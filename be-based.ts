import {VirtualProps, Actions, Proxy, PP, BeBasedRule} from './types';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {processRules} from './processRules.js';



export class BeBased implements Actions{
    intro(proxy: Element & VirtualProps, target: Element, beDecorProps: BeDecoratedProps<any, any>): void {
        proxy.beDecorProps = beDecorProps;
    }
    onRules(pp: PP): void {
        processRules(pp);
    }
}


const tagName = 'be-based';

const ifWantsToBe = 'based';

const upgrade = '*';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
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
        controller: BeBased,
    }
});

register(ifWantsToBe, upgrade, tagName);