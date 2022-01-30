import { BeBasedProps, BeBasedRule } from "./types";

const defaultRule: BeBasedRule = {
    ifNot: "^(http|https)",
};
export const processRules = ({rules, proxy}: BeBasedProps): void => {
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
