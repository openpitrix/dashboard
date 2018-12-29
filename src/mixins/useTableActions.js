import { action, extendObservable } from 'mobx';
import actions from './tableActions';

const useTableActions = Clazz => {
  const instance = new Clazz();

  const ownKeys = Object.getOwnPropertyNames(actions);

  ownKeys.forEach(key => {
    // won't override original class's properties
    if (!instance[key]) {
      const value = actions[key];

      if (typeof value === 'function') {
        const fn = (...args) => {
          value.apply(instance, args);
        };
        // all methods in mixin file will auto-prefix mobx action
        extendObservable(
          instance,
          {
            [key]: fn
          },
          {
            [key]: action
          }
        );
      } else {
        extendObservable(instance, { [key]: value });
      }
    }
  });

  return instance;
};

export default useTableActions;
