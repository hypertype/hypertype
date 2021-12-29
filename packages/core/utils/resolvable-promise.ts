
export class ResolvablePromise<T = void> implements PromiseLike<T> {

  public reject: (value: T | PromiseLike<T>) => void;
  public resolve: (value: T | PromiseLike<T>) => void;
  private promise = new Promise<T>((resolve, reject) => Object.assign(this, {resolve, reject}));

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }
}
