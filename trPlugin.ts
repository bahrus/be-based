import {RenderContext} from 'trans-render/lib/types';
import {BeBasedVirtualProps} from './types';
import {processRules} from './processRules.js';

export function trPlugin({val, target, attrib}: RenderContext){
    const props = JSON.parse(val!) as BeBasedVirtualProps;
    processRules({rules: props.rules, proxy: target as Element & BeBasedVirtualProps, recursive: props.recursive, beDecorProps: props.beDecorProps});
    if(props.once) target!.removeAttribute(attrib!);
}