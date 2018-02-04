var express = require('express');
var router = express.Router();
var Technology = require('../models/technology').Technology;
var _ = require('lodash');
var Project = require('../models/project').Project;

router.get('/', function(req, res, next) {
    Technology.find().then(function(technologies){
        var techGroup = [];
        for(var i=0; i < technologies.length; i+=2) {
            var subGroup = [];
            subGroup.push(technologies[i]);
            if(i+1 < technologies.length) {
                subGroup.push(technologies[i+1]);
            }
            techGroup.push(subGroup);
        }
        res.addData('technologies', techGroup);
        res.setPath([{name: "Home", url: '/'}, {name: 'Technologies'}]);
        res.templateRender('technology/all', 'Technologies');
    });
});

router.get('/add', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'Technologies', url: '/technology'}]);
    res.templateRender('technology/add', 'Add a new Technology');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['key', 'name', 'description']);
    var technology = new Technology(body);
    technology.save().then(function (doc) {
        res.setSuccess('Technology added successfully');
        res.redirect('/technology');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/technology/add');
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    Technology.findOne({tid: req.params.id}).then(function(technology){
        if(!technology) {
            res.redirect404('Technology not found');
        } else {
            var projects = [new Project({pid: 1, name: 'Dummy'})];
            res.addData('projects',projects);
            res.addData('technology', technology);
            res.loadScript('heatMap');
            var links = [];
            for(var i=0; i < projects.length; i++) {
                links.push('/project/json/' + projects[i].pid);
            }
            res.addData('calheatmap_data', links),
            res.setPath([{name: "Home", url: '/'}, {name: 'Technologies', url: '/technology'}, {name: technology.name}]);
            res.templateRender('technology/view', 'Technology: ' + technology.name);
        }
    });
});

module.exports = router;
