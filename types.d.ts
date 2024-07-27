import {IEnhancement, BEAllProps} from './node_modules/trans-render/be/types';

export interface EndUserProps extends IEnhancement{
    forAll?: Array<string>,
    base?: string,
    fileName?: string
    puntOn?: Array<string>,
}

export interface AllProps extends EndUserProps{
    forAll: Array<string>,
}


export interface PuntEvent{
    count: number,
    instance: Element,
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>



export interface Actions{
    hydrate(self: AP & BEAllProps): PAP;
    //finale(): void;
}

