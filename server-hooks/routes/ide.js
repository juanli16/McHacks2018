var express = require('express');
var router = express.Router();
var _ = require('lodash');
var IDE = require('../models/ide').IDE;
var Project = require('../models/project').Project;

router.get('/', function(req, res, next) {
    IDE.find().then(function(ides){
        var ideGroup = [];
        for(var i=0; i < ides.length; i+=2) {
            var subGroup = [];
            subGroup.push(ides[i]);
            if(i+1 < ides.length) {
                subGroup.push(ides[i+1]);
            }
            ideGroup.push(subGroup);
        }
        res.addData('ides', ideGroup);
        res.setPath([{name: "Home", url: '/'}, {name: 'IDEs'}]);
        res.templateRender('ide/all', 'IDEs');
    });
});

router.get('/add', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'IDEs', url: '/ide'}]);
    res.templateRender('ide/add', 'Add a new IDE');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['key', 'name', 'description']);
    var ide = new IDE(body);
    ide.save().then(function (doc) {
        res.setSuccess('IDE added successfully');
        res.redirect('/ide');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/ide/add');
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    IDE.findOne({iid: req.params.id}).then(function(ide){
        if(!ide) {
            res.redirect404('IDE not found');
        } else {
            var projects = [new Project({pid: 1, name: 'Dummy'})];
            res.addData('projects',projects);
            res.addData('ide', ide);
            res.loadScript('heatMap');
            var links = [];
            for(var i=0; i < projects.length; i++) {
                links.push('/project/json/' + projects[i].pid);
            }
            res.addData('calheatmap_data', links),
            res.setPath([{name: "Home", url: '/'}, {name: 'IDEs', url: '/ide'}, {name: ide.name}]);
            res.templateRender('ide/view', 'IDE: ' + ide.name);
        }
    });
});

module.exports = router;
