import {RenderContext} from 'trans-render/lib/types';
import {BeBasedVirtualProps} from './types';
import {processRules} from './processRules.js';

export function trPlugin({val, target}: RenderContext){
    const props = JSON.parse(val) as BeBasedVirtualProps;
    processRules({rules: props.rules, proxy: target});
}