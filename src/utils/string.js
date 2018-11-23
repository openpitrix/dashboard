export const ucfirst = str => str[0].toUpperCase() + str.substring(1);

export const versionCompare = (left, right) => {
  if (typeof left + typeof right !== 'stringstring') {
    return false;
  }

  const a = left.split('.'),
    b = right.split('.'),
    len = Math.max(a.length, b.length);

  for (let i = 0; i < len; i++) {
    if (
      (a[i] && !b[i] && parseInt(a[i]) > 0)
      || parseInt(a[i]) > parseInt(b[i])
    ) {
      return 1;
    }
    if (
      (b[i] && !a[i] && parseInt(b[i]) > 0)
      || parseInt(a[i]) < parseInt(b[i])
    ) {
      return -1;
    }
  }

  return 0;
};
