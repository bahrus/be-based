import { PP, BeBasedRule } from "./types";

const defaultRule: BeBasedRule = {
    ifNot: "^(http|https)",
};
export const processRules = ({rules, proxy, recursive, beDecorProps, self}: PP): void => {
    for(const rule of rules!){
        const newRule = {...defaultRule, ...rule};
        const isTempl = self.localName === "template";
        const fragment = isTempl ? (self as HTMLTemplateElement).content : proxy;
        const elements = Array.from(fragment.querySelectorAll(newRule.selector!));
        for(const element of elements){
            const attr = element.getAttribute(newRule.attr!);
            if(!newRule.ifNot || !newRule.ifNot.match(new RegExp(attr!))){
                element.setAttribute(newRule.attr!, newRule.baseHref! + attr!);
            }
        }
        if(isTempl && recursive && beDecorProps !== undefined){
            fragment.querySelectorAll(`[be-${beDecorProps.ifWantsToBe}]`).forEach(el => {
                const beDecorChildAttr = el.getAttribute(`be-${beDecorProps!.ifWantsToBe}`);
                const beDecorChildProps = JSON.parse(beDecorChildAttr!);
                processRules({
                    rules: beDecorChildProps.rules,
                    self: el,
                    proxy,
                    recursive: beDecorChildProps.recursive,
                    beDecorProps: beDecorProps,
                } as PP);
            });
        }
    }
}
