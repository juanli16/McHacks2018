var express = require('express');
var router = express.Router();
var Project = require('../models/project').Project;
var _ = require('lodash');

router.get('/', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'Project'}, {name: 'All'}]);
    res.templateRender('project/all', 'All projects');
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    Project.findOne({pid: req.params.id}).then(function(project){
        if(!project) {
            res.redirect404('Project not found');
        } else {
            res.addData('project', project);
            res.setPath([{name: "Home", url: '/'}, {name: 'Project'}, {name: 'View'}]);
            res.templateRender('project/view', 'View project');
        }
    });
});

router.get('/add', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'Project'}, {name: 'Add new project'}]);
    res.templateRender('project/add', 'Add project');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['name']);
    var project = new Project(body);
    project.save().then(function (doc) {
        res.setSuccess('Project added successfully');
        res.redirect('/project');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/project/add');
    });
});


module.exports = router;
