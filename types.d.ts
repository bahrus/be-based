import {BeDecoratedProps} from 'be-decorated/types';

export interface BeBasedVirtualProps{
    rules?: BeBasedRule[],
    beDecorProps?: BeDecoratedProps,
    recursive?: boolean,
}

export interface BeBasedProps extends BeBasedVirtualProps{
    proxy:  Element & BeBasedVirtualProps,
}

export interface BeBasedRule {
    selector?: string,
    attr?: string,
    ifNot?: string,
    prependVal?: string,
}

export interface BeBasedActions{
    onRules(self: this): void;
    intro(proxy: Element & BeBasedVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
}

