import {BeBasedVirtualProps, BeBasedActions, BeBasedProps, BeBasedRule} from './types';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';

const defaultRule: BeBasedRule = {
    ifNot: "^(http|https)",
};
export class BeBasedController implements BeBasedActions{
    onRules({rules, proxy}: this): void {
        for(const rule of rules!){
            const newRule = {...defaultRule, ...rule};
            const fragment = proxy.localName === "template" ? (proxy as HTMLTemplateElement).content : proxy;
            const elements = Array.from(fragment.querySelectorAll(newRule.selector!));
            for(const element of elements){
                const attr = element.getAttribute(newRule.attr!);
                if(!newRule.ifNot || !newRule.ifNot.match(new RegExp(attr!))){
                    element.setAttribute(newRule.attr!, newRule.prependVal! + attr!);
                }
            }
        }
    }
}

export interface BeBasedController extends BeBasedProps{}

const tagName = 'be-based';

const ifWantsToBe = 'based';

const upgrade = '*';

define<BeBasedProps & BeDecoratedProps<BeBasedProps, BeBasedActions>, BeBasedActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: ['template'],
            virtualProps: ['rules'],
        },
        actions:{
            onRules: 'rules'
        }
    },
    complexPropDefaults:{
        controller: BeBasedController,
    }
});

register(ifWantsToBe, upgrade, tagName);