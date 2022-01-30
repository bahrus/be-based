import {RenderContext} from 'trans-render/lib/types';
import {BeBasedVirtualProps} from './types';
import {processRules} from './processRules.js';

export function trPlugin({val, target, attrib}: RenderContext){
    const props = JSON.parse(val!) as BeBasedVirtualProps;
    const {rules, recursive, beDecorProps, beVigilant} = props;
    processRules({rules, proxy: target as Element & BeBasedVirtualProps, recursive, beDecorProps});
    if(!beVigilant) target!.removeAttribute(attrib!);
}