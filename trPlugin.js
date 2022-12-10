import { register } from 'trans-render/lib/pluginMgr.js';
export const trPlugin = {
    selector: 'beBasedAttribs',
    ready: true,
    processor: async ({ target, val, attrib, host }) => {
        if (customElements.get('be-based') === undefined)
            return;
        const { attach } = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-based');
        attach(target, 'based', instance.attach.bind(instance));
    }
};
register(trPlugin);
