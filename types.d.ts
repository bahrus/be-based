import {BeDecoratedProps} from 'be-decorated/types';

export interface BeBasedVirtualProps{
    rules?: BeBasedRule[],
    beDecorProps?: BeDecoratedProps,
    recursive?: boolean,
    beVigilant?: boolean,
}

export interface BeBasedProps extends BeBasedVirtualProps{
    proxy:  Element & BeBasedVirtualProps,
}

export interface BeBasedRule {
    selector?: string,
    attr?: string,
    ifNot?: string,
    baseHref?: string,
}

export interface BeBasedActions{
    onRules(self: this): void;
    intro(proxy: Element & BeBasedVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
}

