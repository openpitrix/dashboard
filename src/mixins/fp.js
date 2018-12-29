// functional programming utilities

export const compose = (...fns) => value => fns.reduce((acc, fn) => fn(value));
