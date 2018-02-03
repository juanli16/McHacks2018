const Global = require('../models/global').Global;
const _ = require('lodash');
const jwt = require('jsonwebtoken');

function init(req, res, next) {
    res.data = {};
    next();
}

function global(req, res, next) {
    res.addData('g_webName', '{{CSAlgorithms}}');
    res.addData('g_submissionType', res.getData('g_constant')['SUBMIT_TYPE_MANUAL']);
    Global.find({}).then(function (global) {
        if(global.length > 0) {
            global = global.pop();
            if(!_.isEmpty(global.webName)) {
                res.addData('g_webName', global.webName);
            }
            if(!_.isEmpty(global.contactEmail)) {
                res.addData('g_contactEmail', global.contactEmail);
            }
            if(!_.isEmpty(global.notification)) {
                res.addData('g_notification', global.notification);
            }
            if(!_.isEmpty(global.submissionType)) {
                res.addData('g_submissionType', global.submissionType);
            }
        }
        next();
    }).catch(function (reason) {
        next();
    });
}

function funcTemplateRender(req, res, next) {
    res.templateRender = function(page, title) {

        // Required arguments
        if(_.isUndefined(res) || _.isUndefined(page) || _.isUndefined(title) || _.isUndefined(req)) {
            throw new Error("Render call is missing required arguments");
        }

        // Adjust data object
        res.addData('main_page', page);
        res.addData('main_title', title);

        // Get messages
        res.addData('g_errors', req.flash('g_errors'));
        res.addData('g_success', req.flash('g_success'));
        var post = req.flash('g_post');
        if(post.length > 0) res.addData('g_post', post.pop());

        // Render file
        res.render('index', res.data);
    };
    next();
}

function funcRedirect404(req, res, next) {
    res.redirect404 = function(title) {

        // Required arguments
        if(_.isUndefined(res) || _.isUndefined(title) || _.isUndefined(req)) {
            throw new Error("show404 call is missing required arguments");
        }

        // Configure 404
        res.status(404);
        res.addData('message', title);
        res.addData('error', {status: 404});
        res.templateRender('error', title);
    };
    next();
}

function funcLoadScript(req, res, next) {
    res.loadScript = function(name, options) {
        switch (name) {
            case 'dataTable':
            case 'heatMap':
            case 'ckeditor':
            case 'datetimepicker':
            case 'ace':
                if(_.isUndefined(res.getData('g_script'))) {
                    res.addData('g_script', {});
                }
                res.getData('g_script')[name] = true;
                break;
            default:
                throw new Error('Unknown script name: ' + name);
        }
    };
    next();
}

function funcSetPath(req, res, next) {
    res.setPath = function(path) {
        if(!_.isArray(path)) {
            throw new Error('Path argument must be an array');
        }
        res.addData('_path', path);
    };
    next();
}

function funcSetSuccess(req, res, next) {
    res.setSuccess = function(messages) {
        if(!_.isArray(messages)) {
            messages = [messages];
        }
        req.flash('g_success', messages);
    };
    next();
}

function funcSetErrors(req, res, next) {
    res.setErrors = function(messages) {
        if(!_.isArray(messages)) {
            messages = [messages];
        }
        req.flash('g_errors', messages);
    };
    next();
}

function funcSetReason(req, res, next) {
    res.setReason = function(reason) {
        var messages = [];
        if(reason.errors) {
            for(var key in reason.errors) {
                messages.push(reason.errors[key].message);
            }
        }

        if(messages.length === 0) {
            messages.push('An error occurred');
        }
        res.setErrors(messages);
    };
    next();
}

function funcRedirectPost(req, res, next) {
    res.redirectPost = function(url) {
        req.flash('g_post', req.body);
        res.redirect(url);
    };
    next();
}

function funcAddData(req, res, next) {
    res.addData = function(variable, data) {
        res.data[variable] = data;
    };
    next();
}

function funcGetData(req, res, next) {
    res.getData = function(variable) {
        return res.data[variable];
    };
    next();
}

function funcCookie(req, res, next) {
    var tokenName = 'csa_token';
    res.setCSACookie = function(data) {
        if(!_.isObject(data)) {
            throw new Error('Cookie value must be an object');
        }
        var token = jwt.sign(data, process.env.JWT_SECRET).toString();
        res.cookie(tokenName, token);
    };

    res.unsetCSACookie = function() {
        res.cookie(tokenName, '', {expires: new Date(0)});
    };

    req.getCSACookie = function() {
        var token = req.cookies[tokenName];
        if(!token || _.isUndefined(token)) {
            return Promise.reject();
        }

        return new Promise(function(resolve, reject) {
            try{
                resolve(jwt.verify(token, process.env.JWT_SECRET));
            } catch (e) {
                reject();
            }
        });
    };
    next();
}

function loadConstants(req, res, next) {
    res.addData('constants', require('constants'));
}

module.exports.init = init;
module.exports.global = global;
module.exports.funcTemplateRender = funcTemplateRender;
module.exports.funcRedirect404 = funcRedirect404;
module.exports.funcLoadScript = funcLoadScript;
module.exports.funcSetPath = funcSetPath;
module.exports.funcSetReason = funcSetReason;
module.exports.funcSetErrors = funcSetErrors;
module.exports.funcSetSuccess = funcSetSuccess;
module.exports.funcRedirectPost = funcRedirectPost;
module.exports.funcAddData = funcAddData;
module.exports.funcGetData = funcGetData;
module.exports.funcCookie = funcCookie;
