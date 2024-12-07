// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types.d.ts' */
/**
 * @type {EMC}
 */
export const emc = {
    base: 'be-based',
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
