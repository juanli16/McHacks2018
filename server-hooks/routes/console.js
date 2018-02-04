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
    var console = new Console(body);
    console.save().then(function (doc) {
        res.setSuccess('Console message added successfully');
        res.redirect('/console');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/console');
    });
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    Console.findOne({cid: req.params.id}).then(function(console){
        if(!console) {
            res.redirect404("Console message not found");
        } else {
            res.addData('console', console);
            res.setPath([{name: "Home", url: '/'}, {name: 'Console', url: '/console'},{name: 'Edit'}]);
            res.templateRender('console/edit', 'Edit Console');
        }
    });
});

router.post('/edit/:id(\\d+)', function(req, res, next) {
    var body = _.pick(req.body, ['token', 'message']);
    Console.findOne({cid: req.params.id}).then(function (doc) {
        if(_.isEmpty(doc)) {
            res.redirect404('Console not found');
        } else {
            doc.message = body.message;
            doc.token = body.token;
            doc.save().then(function() {
                res.setSuccess('Console message updated successfully');
                res.redirect('/console/edit/' + req.params.id);
            }).catch(function(reason) {
                res.setReason(reason);
                res.redirectPost('/console/edit/' + req.params.id);
            });
        }
    });
});

router.get('/delete/:id(\\d+)', function(req, res, next) {
    Console.remove({cid: req.params.id}).then(function() {
        res.setSuccess("Console entry deleted successfully");
        res.redirect('/console');
    }).catch(function(reason) {
        res.setReason(reason);
        res.redirect('/console/edit/' + req.params.id);
    });
});

module.exports = router;
