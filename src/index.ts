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
  #observers: Set<IObserver> = new Set();

  pipe<T extends IObservable>(...operations) {
    return pipe<T>(...operations)(this as unknown as T);
  }

  next(...rest) {
    Array.from(this.#observers).forEach((observer: IObserver) => {
      typeof observer === 'function'
        ? observer(...rest)
        : observer.next(...rest);
    });
  }

  error(...rest) {
    Array.from(this.#observers).forEach((observer: IObserver) => {
      observer?.error?.(...rest);
      this.unsubscribe(observer);
    });
  }

  complete(...rest) {
    Array.from(this.#observers).forEach((observer: IObserver) => {
      observer?.complete?.(...rest);
      this.unsubscribe(observer);
    });
  }

  subscribe(observer: IObserver) {
    this.#observers.add(observer);

    return {
      unsubscribe: () => {
        this.unsubscribe(observer);
      },
    };
  }

  unsubscribe(observer: IObserver) {
    this.#observers.delete(observer);
  }
}

export function pipe<T extends IObservable>(
  ...operations: ((operation: T) => T)[]
): (any: T) => T {
  return (any: T): T => {
    return Array.from(operations).reduce(
      (any, operation) => operation(any),
      any
    );
  };
}
