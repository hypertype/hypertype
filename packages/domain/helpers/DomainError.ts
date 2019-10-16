export class DomainError extends Error{
    constructor(public code: DomainErrorCode, public info: string){
        super('Domain logic error');
    }
}

export enum DomainErrorCode {
    NotFound = 404,
    Logic = 1,
}