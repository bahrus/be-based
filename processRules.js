const defaultRule = {
    ifNot: "^(http|https)",
};
export const processRules = ({ rules, proxy, recursive, beDecorProps }) => {
    for (const rule of rules) {
        const newRule = { ...defaultRule, ...rule };
        const isTempl = proxy.localName === "template";
        const fragment = isTempl ? proxy.content : proxy;
        const elements = Array.from(fragment.querySelectorAll(newRule.selector));
        for (const element of elements) {
            const attr = element.getAttribute(newRule.attr);
            if (!newRule.ifNot || !newRule.ifNot.match(new RegExp(attr))) {
                element.setAttribute(newRule.attr, newRule.baseHref + attr);
            }
        }
        if (isTempl && recursive && beDecorProps !== undefined) {
            fragment.querySelectorAll(`[be-${beDecorProps.ifWantsToBe}]`).forEach(el => {
                const beDecorChildAttr = el.getAttribute(`be-${beDecorProps.ifWantsToBe}`);
                const beDecorChildProps = JSON.parse(beDecorChildAttr);
                processRules({
                    rules: beDecorChildProps.rules,
                    proxy: el,
                    recursive: beDecorChildProps.recursive,
                    beDecorProps: beDecorProps,
                });
            });
        }
    }
};
