import {ActionOnEventConfigs} from 'trans-render/froop/types';
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE{
    forAll?: string[],
    base?: string,
    fileName?: string
    puntOn?: string[],
}

export interface AllProps extends EndUserProps{

}


export interface PuntEvent{
    count: number,
    instance: Element,
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export type ProPOA = Promise<POA>

export interface Actions{
    hydrate(self: this): PAP;
    //finale(): void;
}

