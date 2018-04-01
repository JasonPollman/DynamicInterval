import { expect } from 'chai';

import {
  setDynamicInterval,
  clearDynamicInterval,
} from '../src/index';

const tryCatch = (fn, done) => () => {
  try {
    fn();
  } catch (e) {
    done(e);
  }
};

describe('Dynamic Interval', () => {
  describe('clearDynamicInterval', () => {
    it('Should silently fail', () => {
      expect(clearDynamicInterval()).to.equal(undefined);
    });

    it('Should clear a "dynamic interval"', (done) => {
      clearDynamicInterval(setDynamicInterval(() => done('Expected this to be cleared!', 10)));
      setTimeout(() => done(), 50);
    });
  });

  describe('setDynamicInterval', () => {
    it('Should set an interval', (done) => {
      let called = 0;
      let reference;

      const increment = tryCatch(() => {
        if (++called === 3) {
          expect(reference.calls).to.equal(3);
          expect(reference.cleared).to.equal(false);
          clearDynamicInterval(reference);
          expect(reference.cleared).to.equal(true);
          done();
        } else if (called > 3) {
          done(new Error('Called too many times!'));
        }
      }, done);

      reference = setDynamicInterval(increment, 0);
      expect(reference.cleared).to.equal(false);
      expect(reference.clear).to.be.a('function');
      expect(reference.timers).to.be.an('array');
    });

    it('Should terminate when a non-numeric value is returned (1)', (done) => {
      let called = 0;
      let reference;

      const values = [1, 2, '3', 'foo'];
      const increment = tryCatch(() => {
        if (++called === 3) {
          expect(reference.calls).to.equal(3);
          expect(reference.cleared).to.equal(false);
          done();
        } else if (called > 3) {
          done(new Error('Called too many times!'));
        }
      }, done);

      reference = setDynamicInterval(increment, () => values.shift());
      expect(reference.cleared).to.equal(false);
      expect(reference.clear).to.be.a('function');
      expect(reference.timers).to.be.an('array');
    });

    it('Should terminate when a non-numeric value is returned (2)', (done) => {
      const values = ['foo'];
      const increment = () => {
        done(new Error('Called too many times!'));
      };

      const reference = setDynamicInterval(increment, () => values.shift());
      expect(reference.cleared).to.equal(false);
      expect(reference.clear).to.be.a('function');
      expect(reference.timers).to.be.an('array');
      setTimeout(() => done(), 100);
    });

    it('Should works as expected with arrays (shifting from a *clone*)', (done) => {
      let called = 0;
      let reference;

      const values = [1, 2, '3', 'foo'];
      const increment = tryCatch(() => {
        if (++called === 3) {
          expect(reference.calls).to.equal(3);
          expect(reference.cleared).to.equal(false);
          expect(values).to.eql([1, 2, '3', 'foo']);
          done();
        } else if (called > 3) {
          done(new Error('Called too many times!'));
        }
      }, done);

      reference = setDynamicInterval(increment, values);
      expect(reference.cleared).to.equal(false);
      expect(reference.clear).to.be.a('function');
      expect(reference.timers).to.be.an('array');
    });

    it('Should not leak', function leakTest(done) {
      this.timeout(30000);
      this.slow(15000);

      let called = 0;
      let reference;

      const increment = tryCatch(() => {
        if (++called === 1e4) {
          expect(reference.calls).to.equal(1e4);
          expect(reference.cleared).to.equal(false);
          expect(reference.clear()).to.equal(reference);
          expect(reference.cleared).to.equal(true);
          done();
        }
      }, done);

      reference = setDynamicInterval(increment, 0);
      expect(reference.cleared).to.equal(false);
      expect(reference.clear).to.be.a('function');
      expect(reference.timers).to.be.an('array');
    });
  });
});
