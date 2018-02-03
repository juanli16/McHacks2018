const _ = require('lodash');

function init(req, res, next) {
    res.data = {};
    next();
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

module.exports.init = init;
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
