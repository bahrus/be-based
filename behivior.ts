import {BeHive, EMC} from 'be-hive/be-hive.js';
import {MountObserver, MOSE} from 'mount-observer/MountObserver.js';

const base = 'be-based';
export const emc: EMC = {
    base,
    map: {
        '0.0': 'base'
    },
    enhPropKey: 'beBased',
    importEnh: async () => {
        const {BeBased} = await import('./behance.js');
        return BeBased;
    }
};

const mose = document.createElement('script') as MOSE<EMC>;
mose.id = base;
mose.synConfig = emc;

MountObserver.synthesize(document, BeHive, mose);