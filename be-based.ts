import {BeBasedVirtualProps, BeBasedActions, BeBasedProps, BeBasedRule} from './types';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {processRules} from './processRules.js';



export class BeBasedController implements BeBasedActions{
    intro(proxy: Element & BeBasedVirtualProps, target: Element, beDecorProps: BeDecoratedProps<any, any>): void {
        proxy.beDecorProps = beDecorProps;
    }
    onRules({rules, proxy}: this): void {
        processRules({rules, proxy});
    }
}

export interface BeBasedController extends BeBasedProps{}

const tagName = 'be-based';

const ifWantsToBe = 'based';

const upgrade = '*';

define<BeBasedProps & BeDecoratedProps<BeBasedProps, BeBasedActions>, BeBasedActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: ['template'],
            virtualProps: ['rules', 'beDecorProps', 'recursive'],
            intro: 'intro',
        },
        actions:{
            onRules: 'rules'
        }
    },
    complexPropDefaults:{
        controller: BeBasedController,
    }
});

register(ifWantsToBe, upgrade, tagName);