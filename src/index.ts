export interface IObserverFunction {
  (...rest: unknown[]): void;
  [props: string]: any;
}

export interface IObserverObject {
  next: (...rest: unknown[]) => void;
  error?: (...rest: unknown[]) => void;
  complete?: (...rest: unknown[]) => void;
}

export interface IExtendable {
  pipe<T extends IObservable>(...operations: ((operation: T) => T)[]): T;
}

export type IObserver = IObserverObject | IObserverFunction;

export type Subscription = {
  unsubscribe: () => void;
  [props: string]: unknown;
};

export interface IObservable extends IObserverObject, IExtendable {
  subscribe(observer: IObserver): Subscription;
  unsubscribe(observer: IObserver): void;
}

export class Observer implements IObserverObject {
  next() {}
  error() {}
  complete() {}
}

export class Observable implements IObservable {
  #observers: IObserver[] = [];

  pipe(...operations) {
    return pipe<IObservable>(...operations)(this);
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

    return {
      unsubscribe: () => {
        this.unsubscribe(observer);
      },
    };
  }

  unsubscribe(observer: IObserver) {
    const index = this.#observers.indexOf(observer);

    this.#observers.splice(index, 1);
  }
}

export function pipe<T>(...operations: ((operation: T) => T)[]): (any: T) => T {
  return (any: T): T => {
    return Array.from(operations).reduce(
      (any, operation) => operation(any),
      any
    );
  };
}
