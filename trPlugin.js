import { processRules } from './processRules.js';
export function trPlugin({ val, target }) {
    const props = JSON.parse(val);
    processRules({ rules: props.rules, proxy: target });
}
