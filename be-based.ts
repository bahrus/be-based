import {VirtualProps, Actions, Proxy, PP} from './types';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from 'be-hive/register.js';



export class BeBased implements Actions{
    // intro(proxy: Element & VirtualProps, target: Element, beDecorProps: BeDecoratedProps<any, any>): void {
    //     proxy.beDecorProps = beDecorProps;
    // }
    // onRules(pp: PP): void {
    //     processRules(pp);
    // }

    processEl(node: Element, attrib: string, base: string){
        if(!(node as Element).hasAttribute(attrib)) return;
        const val = (node as Element).getAttribute(attrib)!;
        if(val.indexOf('//')) return;
        //TODO:  support paths that start with ..
        const newVal = base + val;
        (node as Element).setAttribute(attrib, newVal);
    }

    doInitial(pp: PP){
        const {self, forAll, base} = pp;
        for(const attrib of forAll!){
            self.querySelectorAll(`[${attrib}]`).forEach(instance => {
                this.processEl(instance, attrib, base!);
            })
        }
        const sr = self.shadowRoot;
        if(sr !== null){
            for(const attrib of forAll!){
                sr.querySelectorAll(`[${attrib}]`).forEach(instance => {
                    this.processEl(instance, attrib, base!);
                })
            }
        }

    }

    hydrate(pp: PP){
        const {self, forAll, base} = pp;
          const observer = new MutationObserver(mutations => {
            mutations.forEach(({
                addedNodes
            }) => {
                addedNodes.forEach(node => {
                    if(node.nodeType != self.ELEMENT_NODE) return;
                    for(const attrib of forAll!){
                        this.processEl(node as Element, attrib, base!);
                    }                                
                });
            });
        });
        observer.observe(self, {
            childList: true,
            subtree: true
        });
        if(self.shadowRoot){
            observer.observe(self.shadowRoot, {
                childList: true,
                subtree: true
            });
        }
        this.doInitial(pp);
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
            forceVisible: ['template'],
            virtualProps: ['base', 'forAll'],
            proxyPropDefaults:{
                forAll: ['src', 'href']
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