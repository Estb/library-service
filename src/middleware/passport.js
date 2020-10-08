require('dotenv-safe').config();
const passport = require('passport');
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWTstrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

// ...

passport.use(
    'login',
    new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
        },
        async (email, password, done) => {
          try {
            if (!email) {
              return done(null, false, {message: 'Email is required'});
            }
            if (!password) {
              return done(null, false, {message: 'Password is required'});
            }

            let user;
            const veryfyUser = (email, password) => {
              if (email == 'user@teste.com' && password == 123456) {
                return (user = {level: 1, id: 123456});
              } else if (email == 'adm@teste.com' && password == 654321) {
                return (user = {level: 2, id: 654321});
              } else return false;
            };

            const validateUsr = veryfyUser(email, password);

            if (!validateUsr) {
              return done(null, false, {status: 401,
                message: 'Wrong  email or Password'});
            }

            return done(null, user, {status: 200,
              message: 'Logged in Successfully'});
          } catch (error) {
            return done(error);
          }
        },
    ),
);

passport.use(
    new JWTstrategy(
        {
          secretOrKey: process.env.SECRET,
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
          try {
            return done(null, token.user);
          } catch (error) {
            done(error);
          }
        },
    ),
);
