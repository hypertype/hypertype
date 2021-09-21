
//region Родительское окно <-> Child-окна

export type TChild = 'chart';

export interface IChildWindowMetadata {
  id: string;
  type: TChild;
  containerType: TWindowContainer;
}

export interface IRemovedChild {
  id: string;
  type: TChild;
}

export type TDetachState =
  'initial' |  // еще не было ни detach ни attach
  'detached' | // откреплен
  'attached'   // прикреплен обратно
  ;

export type TWindowContainer =
  'detached' | // в отдельном окне
  'windowed';  // в окне карты

export type TChildWindowRequest = 'get-state' | 'beforeunload';
export type TParentWindowRequest = 'close';

//endregion
