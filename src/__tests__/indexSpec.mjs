import { jest } from '@jest/globals';

import * as main from '../index';

const {
  default: { Observable },
} = main;

describe('Observable', () => {
  let observable = null;

  beforeEach(() => {
    observable = new Observable();
  });
  describe('subscribe method', () => {
    it('register new function observer', () => {
      const observer = jest.fn();

      observable.subscribe(observer);
      observable.next(1, 2, 3);

      expect(observer).toHaveBeenCalledWith(1, 2, 3);
    });

    it('register new object observer', () => {
      const observer = {
        next: jest.fn(),
        complete: jest.fn(),
      };

      observable.subscribe(observer);
      observable.next(1, 2, 3);
      observable.complete();
      observable.next(4, 5, 6);

      expect(observer.next).toHaveBeenCalledWith(1, 2, 3);
      expect(observer.next).toHaveBeenCalledTimes(1);
      expect(observer.complete).toHaveBeenCalledWith();
    });

    it('register new object observer for error', () => {
      const observer = {
        next: jest.fn(),
        error: jest.fn(),
        complete: jest.fn(),
      };

      observable.subscribe(observer);
      observable.next(1, 2, 3);
      observable.error();
      observable.next(4, 5, 6);

      expect(observer.next).toHaveBeenCalledWith(1, 2, 3);
      expect(observer.next).toHaveBeenCalledTimes(1);
      expect(observer.error).toHaveBeenCalledWith();
    });
  });

  describe('unsubscribe method', () => {
    it('register new observer', () => {
      const observer = jest.fn();

      const unsubscribe = observable.subscribe(observer);
      observable.next(1, 2, 3);
      unsubscribe();
      observable.next(4, 5, 6);

      expect(observer).toHaveBeenCalledTimes(1);
    });
  });
});
