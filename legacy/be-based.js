import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
export class BeBased extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'base'
        };
    }
    #observer;
    hydrate(self) {
        const { enhancedElement, forAll, base, puntOn, fileName } = self;
        if (!base.endsWith('/')) {
            return {
                base: base + '/',
            };
        }
        this.#observer = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(node => {
                    if (!(node instanceof Element))
                        return;
                    for (const attrib of forAll) {
                        this.#processEl(node, attrib, base, fileName);
                    }
                    const shadowRoot = node.getAttribute('shadowroot');
                    if (node instanceof HTMLTemplateElement && shadowRoot !== null) {
                        node.removeAttribute('shadowroot');
                        const parent = node.parentElement;
                        parent.attachShadow({ mode: shadowRoot });
                        parent.shadowRoot.appendChild(node.content.cloneNode(true));
                        node.remove();
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
        this.#observer.observe(enhancedElement, {
            childList: true,
            subtree: true
        });
        if (enhancedElement.shadowRoot) {
            this.#observer.observe(enhancedElement.shadowRoot, {
                childList: true,
                subtree: true
            });
        }
        this.#doInitial(self);
        return {
            resolved: true
        };
    }
    #doInitial(self) {
        //TODO:  support both shadow and light if told to do so
        const { enhancedElement, forAll, base, puntOn, fileName } = self;
        const sr = enhancedElement.shadowRoot;
        if (sr !== null) {
            this.#doFragment(sr, forAll, base, fileName);
        }
        else {
            this.#doFragment(enhancedElement, forAll, base, fileName);
        }
        if (puntOn !== undefined) {
            this.#puntFragment(enhancedElement, puntOn);
            if (sr !== null) {
                this.#puntFragment(sr, puntOn);
            }
            else {
                this.#puntFragment(enhancedElement, puntOn);
            }
        }
    }
    #processEl(node, attrib, base, fileName) {
        if (!node.hasAttribute(attrib))
            return;
        let val = node.getAttribute(attrib);
        if (val.indexOf('//') !== -1)
            return;
        if (val.startsWith('data:'))
            return;
        if (val[0] === '#')
            return;
        //TODO:  support paths that start with ..
        //console.log({attrib, base, val, fileName});
        let newVal;
        if (val.startsWith('../')) {
            let split = base.split('/');
            split.pop();
            while (val.startsWith('../')) {
                val = val.substring(3);
                split.pop();
            }
            newVal = split.join('/') + '/' + val;
            // }else if(val[0] === '#'){
            //     newVal = base + fileName + val;
        }
        else {
            if (val[0] === '/')
                val = val.substring(1); // this doesn't seem right - need to start from domain (?)
            newVal = base + val;
        }
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
    #doFragment(fragment, forAll, base, fileName) {
        for (const attrib of forAll) {
            const attribNS = this.#ns(attrib);
            fragment.querySelectorAll(`[${attribNS}]`).forEach(instance => {
                this.#processEl(instance, attrib, base, fileName);
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
    disconnect() {
        this.#observer?.disconnect();
    }
    detach(detachedElement) {
        this.disconnect();
    }
}
export const tagName = 'be-based';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            forAll: ['src', 'href', 'xlink:href']
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            hydrate: {
                ifAllOf: ['forAll', 'base']
            }
        }
    },
    superclass: BeBased
});
