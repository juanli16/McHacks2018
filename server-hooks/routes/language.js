var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Language = require('../models/language').Language;
var Project = require('../models/project').Project;

router.get('/', function(req, res, next) {
    Language.find().then(function(languages){
        var languageGroup = [];
        for(var i=0; i < languages.length; i+=2) {
            var subGroup = [];
            subGroup.push(languages[i]);
            if(i+1 < languages.length) {
                subGroup.push(languages[i+1]);
            }
            languageGroup.push(subGroup);
        }
        res.addData('languages', languageGroup);
        res.setPath([{name: "Home", url: '/'}, {name: 'Languages'}]);
        res.templateRender('language/all', 'Programming Languages');
    });
});

router.get('/add', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'Programming Languages', url: '/language'}]);
    res.templateRender('language/add', 'Add a new Programming Language');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['key', 'name', 'description']);
    var language = new Language(body);
    language.save().then(function (doc) {
        res.setSuccess('Programming Language added successfully');
        res.redirect('/language');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/language/add');
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    Language.findOne({lid: req.params.id}).then(function(language){
        if(!language) {
            res.redirect404('Programming Language not found');
        } else {
            var projects = [new Project({pid: 1, name: 'Dummy'})];
            res.addData('projects',projects);
            res.addData('language', language);
            res.loadScript('heatMap');
            var links = [];
            for(var i=0; i < projects.length; i++) {
                links.push('/project/json/' + projects[i].pid);
            }
            res.addData('calheatmap_data', links),
            res.setPath([{name: "Home", url: '/'}, {name: 'Programming Languages', url: '/language'}, {name: language.name}]);
            res.templateRender('language/view', 'Programming Language: ' + language.name);
        }
    });
});

module.exports = router;
