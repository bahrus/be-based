// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './node_modules/trans-render/be/types.d.ts' */
const base = 'be-based';
/**
 * @type {EMC}
 */
export const emc = {
    base,
    map: {
        '0.0': 'base'
    },
    enhPropKey: 'beBased',
    importEnh: async () => {
        const { BeBased } = 
            /** @type {{new(): IEnhancement<Element>}} */ 
            /** @type {any} */
            (await import('./be-based.js'));
        return  BeBased;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
