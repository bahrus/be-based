import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
import { processRules } from './processRules.js';
export class BeBasedController {
    intro(proxy, target, beDecorProps) {
        proxy.beDecorProps = beDecorProps;
    }
    onRules({ rules, proxy }) {
        processRules({ rules, proxy });
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
        controller: BeBasedController,
    }
});
register(ifWantsToBe, upgrade, tagName);
