import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeBased {
    #processEl(node, attrib, base) {
        if (!node.hasAttribute(attrib))
            return;
        const val = node.getAttribute(attrib);
        if (val.indexOf('//') !== -1)
            return;
        //TODO:  support paths that start with ..
        const separator = (!base.endsWith('/') && !val.startsWith('/')) ? '/' : '';
        const newVal = base + separator + val;
        node.setAttribute(attrib, newVal);
    }
    #doInitial(pp) {
        const { self, forAll, base } = pp;
        for (const attrib of forAll) {
            const split = attrib.split(':');
            if (split.length > 1) {
                split[0] = '*';
            }
            ;
            const attribNS = split.join('|');
            self.querySelectorAll(`[${attribNS}]`).forEach(instance => {
                this.#processEl(instance, attrib, base);
            });
        }
        const sr = self.shadowRoot;
        if (sr !== null) {
            for (const attrib of forAll) {
                sr.querySelectorAll(`[${attrib}]`).forEach(instance => {
                    this.#processEl(instance, attrib, base);
                });
            }
        }
    }
    #observer;
    hydrate(pp) {
        const { self, forAll, base } = pp;
        this.#observer = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(node => {
                    if (node.nodeType != self.ELEMENT_NODE)
                        return;
                    for (const attrib of forAll) {
                        this.#processEl(node, attrib, base);
                    }
                });
            });
        });
        this.#observer.observe(self, {
            childList: true,
            subtree: true
        });
        if (self.shadowRoot) {
            this.#observer.observe(self.shadowRoot, {
                childList: true,
                subtree: true
            });
        }
        this.#doInitial(pp);
        return {
            resolved: true,
        };
    }
    disconnect() {
        this.#observer?.disconnect();
    }
    finale() {
        this.disconnect();
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
            finale: 'finale',
            forceVisible: ['template'],
            virtualProps: ['base', 'forAll'],
            proxyPropDefaults: {
                forAll: ['src', 'href', 'xlink:href']
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
