//region Родительское окно <-> Child-окна

export interface IChildWindowMetadata {
  childId: string;
  childType: string;
}

export type TDetachState =
  'initial' |  // еще не было ни detach ни attach
  'detached' | // откреплено
  'attached';  // прикреплено обратно

export type TParentWindowRequest = 'close';
export type TChildWindowRequest = 'connected' | 'disconnected';

//endregion
