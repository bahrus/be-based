import {VirtualProps, Actions, Proxy, PP, PA, PuntEvent} from './types';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from 'be-hive/register.js';



export class BeBased extends EventTarget implements Actions{

    #doInitial(pp: PP){
        //TODO:  support both shadow and light if told to do so
        const {self, forAll, base, puntOn} = pp;
        const sr = self.shadowRoot;
        if(sr !== null){
            this.#doFragment(sr, forAll!, base!);
        }else{
            this.#doFragment(self, forAll!, base!);
        }
        

        if(puntOn !== undefined){
            this.#puntFragment(self, puntOn);
            if(sr !== null){
                this.#puntFragment(sr, puntOn);
            }else{
                this.#puntFragment(self, puntOn);
            }
        }
    }

    #doFragment(fragment: Element | ShadowRoot, forAll: string[], base: string){
        for(const attrib of forAll){
            const attribNS = this.#ns(attrib);
            fragment.querySelectorAll(`[${attribNS}]`).forEach(instance => {
                this.#processEl(instance, attrib, base!);
            })
        }
    }
    #puntCount: {[key: string]: number} = {};

    #puntFragment(fragment: Element | ShadowRoot, puntOn: string[]){
        this.#puntCount = {};
        for(const selector of puntOn){
            fragment.querySelectorAll(selector).forEach(instance => {
                this.#processPunt(selector, instance as Element);
            });
        }
        
    }

    #processPunt(selector: string, instance: Element){
        if(this.#puntCount[selector] === undefined){
            this.#puntCount[selector] = 0;
        }
        this.#puntCount[selector]++;
        this.dispatchEvent(new CustomEvent(selector, {
            detail:{
                count: this.#puntCount[selector],
                instance
            } as PuntEvent,
        }));
    }

    #processEl(node: Element, attrib: string, base: string){
        if(!(node as Element).hasAttribute(attrib)) return;
        const val = (node as Element).getAttribute(attrib)!;
        if(val.indexOf('//') !== -1) return;
        if(val.startsWith('data:')) return;
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



    #observer: MutationObserver | undefined;
    hydrate(pp: PP){
        const {self, forAll, base, puntOn} = pp;
        this.#observer = new MutationObserver(mutations => {
            mutations.forEach(({
                addedNodes
            }) => {
                addedNodes.forEach(node => {
                    if(!(node instanceof Element)) return;
                    for(const attrib of forAll!){
                        this.#processEl(node as Element, attrib, base!);
                    }
                    const shadowRoot = node.getAttribute('shadowroot') as 'open' | 'closed' | null;
                    if(node instanceof HTMLTemplateElement && shadowRoot !== null){
                        node.removeAttribute('shadowroot');
                        const parent = node.parentElement!;
                        parent.attachShadow({mode: shadowRoot});
                        parent.shadowRoot!.appendChild(node.content.cloneNode(true));
                        node.remove();
                    }
                    if(puntOn !== undefined){
                        for(const selector of puntOn){
                            if((node as Element).matches(selector)){
                                this.#processPunt(selector, node as Element);
                            }
                        }
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