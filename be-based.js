import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
const defaultRule = {
    ifNot: "^(http|https)",
};
export class BeBasedController {
    onRules({ rules, proxy }) {
        for (const rule of rules) {
            const newRule = { ...defaultRule, ...rule };
            const fragment = proxy.localName === "template" ? proxy.content : proxy;
            const elements = Array.from(fragment.querySelectorAll(newRule.selector));
            for (const element of elements) {
                const attr = element.getAttribute(newRule.attr);
                if (!newRule.ifNot || !newRule.ifNot.match(new RegExp(attr))) {
                    element.setAttribute(newRule.attr, newRule.prependVal + attr);
                }
            }
        }
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
            virtualProps: ['rules'],
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
