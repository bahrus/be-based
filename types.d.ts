import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps{
    forAll?: string[],
    base?: string,
    
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    beDecorProps?: BeDecoratedProps,
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy:  Proxy,
}

export type PP = ProxyProps;


export interface Actions{
    hydrate(pp: PP): void;
    finale(): void;
}

