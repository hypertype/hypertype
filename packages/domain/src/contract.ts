//region Родительское окно <-> Child-окна

export interface IChildWindowMetadata {
  id: string;
  type: string;
  size?: { width: number; height: number; };
  position?: { X: number; Y: number; };
}

export type TDetachState =
  'initial' |  // еще не было ни detach ни attach
  'detached' | // откреплен
  'attached';  // прикреплен обратно

export type TChildWindowRequest = 'connected' | 'disconnected';
export type TParentWindowRequest = 'close';

//endregion
