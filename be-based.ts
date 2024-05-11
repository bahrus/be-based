import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, PAP, AllProps, AP} from './types';
import {MountObserver} from 'mount-observer/MountObserver.js';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';

export class BeBased extends BE<Element> implements Actions{
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propInfo: {
            ...(beCnfg.propInfo),
            forAll:{
                def: ['src', 'href', 'xlink:href']
            },
            base:{}
        },
        actions:{
            hydrate:{
                ifAllOf: ['forAll', 'base']
            }
        }
    };
    hydrate(self: this): PAP {
        const {forAll, base, fileName} = self;
        if(!base!.endsWith('/')){
            return {
                base: base + '/',
            };
        }
        const mo = new MountObserver({
            on: forAll!.map(x => `[${x}]`).join(','),
            do: {
                mount: (matchingElement) => {
                    for(const attrib of forAll!){
                        this.#processEl(matchingElement, attrib, base!, fileName);
                    }
                }
            }
        });
        return {
            resolved: true,
        }
    }

    #processEl(node: Element, attrib: string, base: string, fileName?: string){
        if(!(node as Element).hasAttribute(attrib)) return;
        let val = (node as Element).getAttribute(attrib)!;
        if(val.indexOf('//') !== -1) return;
        if(val.startsWith('data:')) return;
        if(val[0] === '#') return;
        //TODO:  support paths that start with ..
        //console.log({attrib, base, val, fileName});
        let newVal: string | undefined;
        if(val.startsWith('../')){
            let split = base.split('/');
            split.pop();
            while(val.startsWith('../')){
                val = val.substring(3);
                split.pop();
            }
            newVal = split.join('/') + '/' + val;
        // }else if(val[0] === '#'){
        //     newVal = base + fileName + val;
        }else{
            if(val[0] ==='/') val = val.substring(1); // this doesn't seem right - need to start from domain (?)
            newVal = base + val;
        }
        (node as Element).setAttribute(attrib, newVal);
    }
}

export interface BeBased extends AllProps{}