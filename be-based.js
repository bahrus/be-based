import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
import { processRules } from './processRules.js';
export class BeBased {
    intro(proxy, target, beDecorProps) {
        proxy.beDecorProps = beDecorProps;
    }
    onRules(pp) {
        processRules(pp);
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
            virtualProps: ['rules', 'beDecorProps', 'recursive'],
            intro: 'intro',
        },
        actions: {
            onRules: 'rules'
        }
    },
    complexPropDefaults: {
        controller: BeBased,
    }
});
register(ifWantsToBe, upgrade, tagName);
