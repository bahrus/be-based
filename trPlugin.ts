import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {VirtualProps, PP, Proxy} from './types';
import {processRules} from './processRules.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beBasedAttribs',
    processor: ({val, target, attrib}: RenderContext) => {
        const props = JSON.parse(val!) as VirtualProps;
        const {rules, recursive, beDecorProps, beVigilant} = props;
        processRules({rules, proxy: target as any as Proxy, recursive, beDecorProps} as PP);
        if(!beVigilant) target!.removeAttribute(attrib!);
    }
};
