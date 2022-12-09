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

    hydrate(pp: PP){
        const {self, forAll, base} = pp;
          const observer = new MutationObserver(mutations => {
            mutations.forEach(({
                addedNodes
            }) => {
                addedNodes.forEach(node => {
                    if(node.nodeType != self.ELEMENT_NODE) return;
                    for(const attrib of forAll!){
                        if(!(node as Element).hasAttribute(attrib)) continue;
                        const val = (node as Element).getAttribute(attrib)!;
                        if(val.indexOf('//')) continue;
                        //TODO:  support paths that start with ..
                        const newVal = base + val;
                        (node as Element).setAttribute(attrib, newVal);
                    }                                
                });
            });
        });
        observer.observe(self.shadowRoot || self  as Element, {
            childList: true,
            subtree: true
        });
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