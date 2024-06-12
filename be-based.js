import { config as beCnfg } from 'be-enhanced/config.js';
import { BE } from 'be-enhanced/BE.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
class BeBased extends BE {
    static config = {
        propInfo: {
            ...(beCnfg.propInfo),
            forAll: {
                def: ['src', 'href', 'xlink\\:href']
            },
            base: {}
        },
        actions: {
            hydrate: {
                ifAllOf: ['forAll', 'base']
            }
        }
    };
    #mo;
    hydrate(self) {
        const { forAll, base, fileName, enhancedElement } = self;
        if (!base.endsWith('/')) {
            return {
                base: base + '/',
            };
        }
        const mo = new MountObserver({
            on: forAll.map(x => `[${x}]`).join(','),
            do: {
                mount: (matchingElement) => {
                    for (const attrib of forAll) {
                        this.#processEl(matchingElement, attrib, base, fileName);
                    }
                }
            }
        });
        mo.observe(enhancedElement);
        this.#mo = mo;
        return {
            resolved: true,
        };
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
        let newVal;
        if (val.startsWith('../')) {
            let split = base.split('/');
            split.pop();
            while (val.startsWith('../')) {
                val = val.substring(3);
                split.pop();
            }
            newVal = split.join('/') + '/' + val;
        }
        else {
            if (val[0] === '/')
                val = val.substring(1); // this doesn't seem right - need to start from domain (?)
            newVal = base + val;
        }
        node.setAttribute(attrib, newVal);
    }
    disconnect(el) {
        if (this.#mo !== undefined)
            this.#mo.disconnect(el);
    }
    async detach(el) {
        this.disconnect(el);
    }
}
await BeBased.bootUp();
export { BeBased };
