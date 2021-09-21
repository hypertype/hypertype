
//region Родительское окно <-> Child-окна

export type TChild = 'chart';

export interface IChildWindowMetadata {
  id: string;
  type: TChild;
  size?: { width: number; height: number; };
  position?: { X: number; Y: number; };
}

export type TDetachState =
  'initial' |  // еще не было ни detach ни attach
  'detached' | // откреплен
  'attached';  // прикреплен обратно

export type TChildWindowRequest = 'get-state' | 'beforeunload';
export type TParentWindowRequest = 'close';

//endregion
