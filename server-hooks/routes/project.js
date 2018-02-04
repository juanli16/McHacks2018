var express = require('express');
var router = express.Router();
var Project = require('../models/project').Project;
var _ = require('lodash');

router.get('/', function(req, res, next) {
    Project.find().then(function(projects) {
        res.addData('projects', projects);
        res.loadScript('heatMap');
        var links = [];
        for(var i=0; i < projects.length; i++) {
            links.push('/project/json/' + projects[i].pid);
        }
        res.addData('calheatmap_data', links),
        res.setPath([{name: "Home", url: '/'}, {name: 'Projects'}]);
        res.templateRender('project/all', 'All projects');
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    Project.findOne({pid: req.params.id}).then(function(project){
        if(!project) {
            res.redirect404('Project not found');
        } else {
            res.addData('project', project);
            res.loadScript('heatMap');
            res.addData('calheatmap_data', ['/project/json/' + project.pid]),
            res.setPath([{name: "Home", url: '/'}, {name: 'Projects', url: '/project'}, {name: project.name}]);
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

router.get('/json/:id(\\d+)', function(req, res, next) {
    res.send({
        946702811: 14
    });
});

module.exports = router;
