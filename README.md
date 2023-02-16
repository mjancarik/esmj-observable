# Observable

The `@esmj/observable` is tiny observable library for other extensibility. 

## Requirements

- Node 18+

## Install

```shell
npm install @esmj/observable
```

## Usage

It works for both Javascript modules (ESM and CJS).

```javascript 
import { Observable, IObservable, IObserver } from '@esmj/monitor';

const observer: IObserver = {
  next(value) {
    console.log(value);
  }
}

const observable: IObservable = new Observable();

const { unsubscribe } = observable.subscribe(observer);

observable.next('Hello world'); // log: Hello world

unsubscribe();

```
## API
### observable = new Observable()
Create a new instance of Observable.

#### pipe(...rest: ((observable) => observable)[])
Extends default observable logic.

#### next(...rest: any[])
Monitoring start measure node metric.

#### complete(...rest: any[])
Monitoring stop measure node metric.

#### error(...rest: any[])
Monitoring start measure node metric.

#### subscribe(observer)
Subscribe observer.

Returns an subscription object with unsubscribe method.

##### observer
Type: `() => void | { next: () => void, error?: () => void, complete?: () => void}`

#### unsubscribe(observer)
Remove observer.

##### observer
Type: `() => void | { ?next: () => void, error?: () => void, complete?: () => void}`