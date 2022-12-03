export interface IObserverFunction {
  (...rest: unknown[]): void;
  [props: string]: any;
}

export interface IObserverObject {
  next: (...rest: unknown[]) => void;
  error?: (...rest: unknown[]) => void;
  complete?: (...rest: unknown[]) => void;
}

export type IObserver = IObserverObject | IObserverFunction;

export interface IObservable {
  pipe<T extends IObservable>(...operations: ((operation: T) => T)[]): T;
  next(...rest: unknown[]): void;
  error(...rest: unknown[]): void;
  complete(...rest: unknown[]): void;
  subscribe(observer: IObserver): () => void;
  unsubscribe(observer: IObserver): void;
}

export class Observable implements IObservable {
  #observers: IObserver[] = [];

  pipe(...operations) {
    return Array.from(operations).reduce(
      (observable, operation) => operation(observable),
      this
    );
  }

  next(...rest) {
    this.#observers.forEach((observer: IObserver) => {
      typeof observer === 'function'
        ? observer(...rest)
        : observer.next(...rest);
    });
  }

  error(...rest) {
    this.#observers.forEach((observer: IObserver) => {
      observer?.error?.(...rest);
      this.unsubscribe(observer);
    });
  }

  complete(...rest) {
    this.#observers.forEach((observer: IObserver) => {
      observer?.complete?.(...rest);
      this.unsubscribe(observer);
    });
  }

  subscribe(observer: IObserver) {
    this.#observers.push(observer);

    return () => {
      this.unsubscribe(observer);
    };
  }

  unsubscribe(observer: IObserver) {
    const index = this.#observers.indexOf(observer);

    this.#observers.splice(index, 1);
  }
}
