import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {BeBasedVirtualProps} from './types';
import {processRules} from './processRules.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beBasedAttribs',
    processor: ({val, target, attrib}: RenderContext) => {
        const props = JSON.parse(val!) as BeBasedVirtualProps;
        const {rules, recursive, beDecorProps, beVigilant} = props;
        processRules({rules, proxy: target as Element & BeBasedVirtualProps, recursive, beDecorProps});
        if(!beVigilant) target!.removeAttribute(attrib!);
    }
};
