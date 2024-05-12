import './behance.js';
import { BeHive } from 'be-hive/be-hive.js';
BeHive.registry.register({
    base: 'be-based',
    enhPropKey: 'beBased',
    map: {
        '0.0': 'base'
    },
    do: {
        mount: {
            import: async () => {
                const { BeBased } = await import('./be-based.js');
                return BeBased;
            }
        }
    }
});
