import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps{
    forAll?: string[],
    base?: string,
    puntOn?: string[],
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    beDecorProps?: BeDecoratedProps,
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy:  Proxy,
}

export type PP = ProxyProps;

export type PA = Partial<PP>;

export interface Actions{
    hydrate(pp: PP): PA;
    finale(): void;
}

