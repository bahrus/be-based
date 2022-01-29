import {BeDecoratedProps} from 'be-decorated/types';

export interface BeBasedVirtualProps{
    rules?: BeBasedRule[]
}

export interface BeBasedProps extends BeBasedVirtualProps{
    proxy:  Element & BeBasedVirtualProps,
}

export interface BeBasedRule {
    selector: string,
    attr: string,
    ifNot: string,
    prependVal: string,
}

export interface BeBasedActions{

}

