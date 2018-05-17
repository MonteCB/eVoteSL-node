const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/electionCommissioner');
const config = require('../config/database');
const Booth = require('../models/booth');
const PollOperator = require('../models/pollOperator');


//configuration which reads the JWT from the http Authorization header
module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {     //jwt_payload consists of th user data in the database
        if(jwt_payload.data.usertype=="sAdmin"){
            User.getUserById(jwt_payload.data._id, (err, user) => {     //payload by the id
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);

                }
            });
        } 
        else if(jwt_payload.data.usertype=="admin"){
            User.getUserById(jwt_payload.data._id, (err, user) => {  
                   //payload by the id
                   
                if (err) {

                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                    console.log(jwt_payload);
                } else {
                    return done(null, false);

                }
            });
        }
        else if(jwt_payload.data.usertype=="booth"){
            Booth.getBoothById(jwt_payload.data._id, (err, user) => {     //payload by the id
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);

                }
            });
        }
        else if(jwt_payload.data.usertype=="poll Operator"){
            PollOperator.getUserById(jwt_payload.data._id, (err, user) => {     //payload by the id
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);

                }
            });
        }      
    }));

}

// module.exports = function (passport) {
//     let opts = {};
//     opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
//     opts.secretOrKey = config.secret;
//     passport.use(new JwtStrategy(opts, (jwt_payload, done) => {     //jwt_payload consists of th user data in the database
//         console.log("aa"+jwt_payload);
//         Booth.getBoothById(jwt_payload.data._id, (err, user) => {     //payload by the id
//             if (err) {
//                 return done(err, false);
//             }
//             if (user) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);

//             }
//         });
//     }));

// }
