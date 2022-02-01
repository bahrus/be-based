import { processRules } from './processRules.js';
export const trPlugin = {
    selector: 'beBasedAttribs',
    processor: ({ val, target, attrib }) => {
        const props = JSON.parse(val);
        const { rules, recursive, beDecorProps, beVigilant } = props;
        processRules({ rules, proxy: target, recursive, beDecorProps });
        if (!beVigilant)
            target.removeAttribute(attrib);
    }
};
