const User = require('../models/user').User;
const _ = require('lodash');

var authenticate = function(req, res, next) {
    req.getCSACookie().then(function(token) {
        if(token._id) {
            User.findOne({_id: token._id}).then(function(user) {
                if(user) {
                    res.addData('me', user);
                }
                next();
            });
        } else {
            next();
        }
    }).catch(function(){
        next();
    });
};

var loggedin = function(req, res, next) {
    var user = res.getData('me');
    if(user && !_.isUndefined(user) && !_.isNull(user)) {
        next();
    } else {
        res.redirect404('Page not found');
    }
};

var admin = function(req, res, next) {
    loggedin(req, res, function () {
        var user = res.getData('me');
        if(user.admin) {
            next();
        } else {
            res.redirect404('Page not found');
        }
    });
};

module.exports.authenticate = authenticate;
module.exports.loggedin = loggedin;
module.exports.admin = admin;
