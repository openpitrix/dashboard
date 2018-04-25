// only handle one-time client side webpack
// when server side code is changed

module.exports = async (ctx, next) => {
  //
  await next();
};
