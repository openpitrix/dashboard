import { isObject } from '../utils/types';

// this mixin apply to class definition
const mixin = trait => target => {
  if (!isObject(trait)) {
    throw Error('mixin first argument should be object');
  }

  const ownKeys = Object.getOwnPropertyNames(trait);
  ownKeys.forEach(key => {
    // watch out this binding
    const value = trait[key];

    // define property on target's prototype
    Object.defineProperty(target.prototype, key, {
      writable: true,
      value
    });
  });

  return target;
};

export default mixin;

// export other useful mixins
export useTableActions from './useTableActions';
