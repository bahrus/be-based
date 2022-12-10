import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeBased extends EventTarget {
    #doInitial(pp) {
        //TODO:  support both shadow and light if told to do so
        const { self, forAll, base, puntOn } = pp;
        const sr = self.shadowRoot;
        if (sr !== null) {
            this.#doFragment(sr, forAll, base);
        }
        else {
            this.#doFragment(self, forAll, base);
        }
        if (puntOn !== undefined) {
            this.#puntFragment(self, puntOn);
            if (sr !== null) {
                this.#puntFragment(sr, puntOn);
            }
            else {
                this.#puntFragment(self, puntOn);
            }
        }
    }
    #doFragment(fragment, forAll, base) {
        for (const attrib of forAll) {
            const attribNS = this.#ns(attrib);
            fragment.querySelectorAll(`[${attribNS}]`).forEach(instance => {
                this.#processEl(instance, attrib, base);
            });
        }
    }
    #puntCount = {};
    #puntFragment(fragment, puntOn) {
        this.#puntCount = {};
        for (const selector of puntOn) {
            fragment.querySelectorAll(selector).forEach(instance => {
                this.#processPunt(selector, instance);
            });
        }
    }
    #processPunt(selector, instance) {
        if (this.#puntCount[selector] === undefined) {
            this.#puntCount[selector] = 0;
        }
        this.#puntCount[selector]++;
        this.dispatchEvent(new CustomEvent(selector, {
            detail: {
                count: this.#puntCount[selector],
                instance
            },
        }));
    }
    #processEl(node, attrib, base) {
        if (!node.hasAttribute(attrib))
            return;
        const val = node.getAttribute(attrib);
        if (val.indexOf('//') !== -1)
            return;
        if (val.startsWith('data:'))
            return;
        //TODO:  support paths that start with ..
        const separator = (!base.endsWith('/') && !val.startsWith('/')) ? '/' : '';
        const newVal = base + separator + val;
        node.setAttribute(attrib, newVal);
    }
    #ns(attrib) {
        const split = attrib.split(':');
        if (split.length > 1) {
            split[0] = '*';
        }
        ;
        return split.join('|');
    }
    #observer;
    hydrate(pp) {
        const { self, forAll, base, puntOn } = pp;
        this.#observer = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(node => {
                    if (node.nodeType != self.ELEMENT_NODE)
                        return;
                    for (const attrib of forAll) {
                        this.#processEl(node, attrib, base);
                    }
                    if (puntOn !== undefined) {
                        for (const selector of puntOn) {
                            if (node.matches(selector)) {
                                this.#processPunt(selector, node);
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
