import {BeHive, EMC, seed, MountObserver} from 'be-hive/be-hive.js';

const base = 'be-based';
export const emc: EMC = {
    base,
    map: {
        '0.0': 'base'
    },
    enhPropKey: 'beBased',
    importEnh: async () => {
        const {BeBased} = await import('./be-based.js');
        return BeBased;
    }
};

const mose = seed(emc);

MountObserver.synthesize(document, BeHive, mose);