import PopperJs from 'popper.js'; // eslint-disable-line import/no-extraneous-dependencies

export default class Popper {
  static placements = PopperJs.placements;

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {}
    };
  }
}
