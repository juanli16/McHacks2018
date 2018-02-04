var express = require('express');
var router = express.Router();
var Console = require('../models/console').Console;
var _ = require('lodash');

router.get('/', function(req, res, next) {
    Console.find().sort({cid: 'desc'}).then(function(consoles){
        for(var i =0; i < consoles.length; i++) {
            consoles[i].prettyMessage = consoles[i].consoleMessage();
        }
        res.setPath([{name: "Home", url: '/'}, {name: 'Console'}]);
        res.addData('consoles', consoles);
        res.templateRender('console/console', 'Console');
    });
});

router.get('/print', function(req, res, next) {
    Console.find().sort({cid: 'desc'}).limit(1).then(function(consoles){
        res.set({ 'content-type': 'application/json; charset=utf-8' })
        if(consoles.length === 1) {
            res.send(consoles[0].consoleMessage());
        } else {
            res.send("");
        }
    });
});

router.post('/', function(req, res, next) {
    var body = _.pick(req.body, ['token', 'message']);
    var project = new Console(body);
    project.save().then(function (doc) {
        res.setSuccess('Console message added successfully');
        res.redirect('/console');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/console');
    });
});


module.exports = router;
