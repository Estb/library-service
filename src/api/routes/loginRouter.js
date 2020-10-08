const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = (
    app,
    controllers,
    httpResponseHelper,
    repository,
    middleware,
) => {
  const rh = httpResponseHelper;

  app.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          return rh(res).error(info);
        }

        req.login(user, {session: false}, async (error) => {
          if (error) return next(error);

          const token = jwt.sign({user}, process.env.SECRET);

          return res.json({token});
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });
};
