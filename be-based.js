import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeBased {
    // intro(proxy: Element & VirtualProps, target: Element, beDecorProps: BeDecoratedProps<any, any>): void {
    //     proxy.beDecorProps = beDecorProps;
    // }
    // onRules(pp: PP): void {
    //     processRules(pp);
    // }
    processEl(node, attrib, base) {
        if (!node.hasAttribute(attrib))
            return;
        const val = node.getAttribute(attrib);
        if (val.indexOf('//'))
            return;
        //TODO:  support paths that start with ..
        const newVal = base + val;
        node.setAttribute(attrib, newVal);
    }
    doInitial(pp) {
        const { self, forAll, base } = pp;
        for (const attrib of forAll) {
            self.querySelectorAll(`[${attrib}]`).forEach(instance => {
                this.processEl(instance, attrib, base);
            });
        }
        const sr = self.shadowRoot;
        if (sr !== null) {
            for (const attrib of forAll) {
                sr.querySelectorAll(`[${attrib}]`).forEach(instance => {
                    this.processEl(instance, attrib, base);
                });
            }
        }
    }
    hydrate(pp) {
        const { self, forAll, base } = pp;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(node => {
                    if (node.nodeType != self.ELEMENT_NODE)
                        return;
                    for (const attrib of forAll) {
                        this.processEl(node, attrib, base);
                    }
                });
            });
        });
        observer.observe(self, {
            childList: true,
            subtree: true
        });
        if (self.shadowRoot) {
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
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            forceVisible: ['template'],
            virtualProps: ['base', 'forAll'],
            proxyPropDefaults: {
                forAll: ['src', 'href']
            },
            primaryProp: 'base'
        },
        actions: {
            hydrate: {
                ifAllOf: ['forAll', 'base']
            }
        }
    },
    complexPropDefaults: {
        controller: BeBased,
    }
});
register(ifWantsToBe, upgrade, tagName);
