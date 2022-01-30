import { processRules } from './processRules.js';
export function trPlugin({ val, target, attrib }) {
    const props = JSON.parse(val);
    processRules({ rules: props.rules, proxy: target, recursive: props.recursive, beDecorProps: props.beDecorProps });
    if (props.once)
        target.removeAttribute(attrib);
}
