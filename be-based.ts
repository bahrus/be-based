import {VirtualProps, Actions, Proxy, PP, PA} from './types';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from 'be-hive/register.js';



export class BeBased implements Actions{

    #processEl(node: Element, attrib: string, base: string){
        if(!(node as Element).hasAttribute(attrib)) return;
        const val = (node as Element).getAttribute(attrib)!;
        if(val.indexOf('//') !== -1) return;
        //TODO:  support paths that start with ..
        const separator = (!base.endsWith('/') && !val.startsWith('/')) ? '/' : ''; 
        const newVal = base + separator + val;
        (node as Element).setAttribute(attrib, newVal);
    }

    #ns(attrib: string){
        const split = attrib.split(':');
        if(split.length > 1){
            split[0] = '*'
        };
        return split.join('|');
    }

    #doInitial(pp: PP){
        const {self, forAll, base} = pp;
        for(const attrib of forAll!){
            const attribNS = this.#ns(attrib);
            self.querySelectorAll(`[${attribNS}]`).forEach(instance => {
                this.#processEl(instance, attrib, base!);
            })
        }
        const sr = self.shadowRoot;
        if(sr !== null){
            for(const attrib of forAll!){
                const attribNS = this.#ns(attrib);
                sr.querySelectorAll(`[${attribNS}]`).forEach(instance => {
                    this.#processEl(instance, attrib, base!);
                })
            }
        }

    }

    #observer: MutationObserver | undefined;
    hydrate(pp: PP){
        const {self, forAll, base} = pp;
          this.#observer = new MutationObserver(mutations => {
            mutations.forEach(({
                addedNodes
            }) => {
                addedNodes.forEach(node => {
                    if(node.nodeType != self.ELEMENT_NODE) return;
                    for(const attrib of forAll!){
                        this.#processEl(node as Element, attrib, base!);
                    }                                
                });
            });
        });
        this.#observer.observe(self, {
            childList: true,
            subtree: true
        });
        if(self.shadowRoot){
            this.#observer.observe(self.shadowRoot, {
                childList: true,
                subtree: true
            });
        }
        this.#doInitial(pp);
        return {
            resolved: true,
        } as PA;
    }

    disconnect(){
        this.#observer?.disconnect();
    }

    finale(): void {
        this.disconnect();
    }
}


const tagName = 'be-based';

const ifWantsToBe = 'based';

const upgrade = '*';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            finale: 'finale',
            forceVisible: ['template'],
            virtualProps: ['base', 'forAll'],
            proxyPropDefaults:{
                forAll: ['src', 'href', 'xlink:href']
            },
            primaryProp: 'base'
        },
        actions:{
            hydrate: {
                ifAllOf: ['forAll', 'base']
            }
        }
    },
    complexPropDefaults:{
        controller: BeBased,
    }
});

register(ifWantsToBe, upgrade, tagName);