var express = require('express');
var router = express.Router();
var API = require('../models/api').API;
var _ = require('lodash');
var Project = require('../models/project').Project;

router.get('/', function(req, res, next) {
    API.find().then(function(apis){
        var apiGroup = [];
        for(var i=0; i < apis.length; i+=2) {
            var subGroup = [];
            subGroup.push(apis[i]);
            if(i+1 < apis.length) {
                subGroup.push(apis[i+1]);
            }
            apiGroup.push(subGroup);
        }
        res.addData('apis', apiGroup);
        res.setPath([{name: "Home", url: '/'}, {name: 'APIs'}]);
        res.templateRender('api/all', 'API');
    });
});

router.get('/add', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'APIs', url: '/api'}]);
    res.templateRender('api/add', 'Add a new API');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['key', 'name', 'description']);
    var api = new API(body);
    api.save().then(function (doc) {
        res.setSuccess('API added successfully');
        res.redirect('/api');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/api/add');
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    API.findOne({aid: req.params.id}).then(function(api){
        if(!api) {
            res.redirect404('API not found');
        } else {
            var projects = [new Project({pid: 1, name: 'Dummy'})];
            res.addData('projects',projects);
            res.addData('api', api);
            res.loadScript('heatMap');
            var links = [];
            for(var i=0; i < projects.length; i++) {
                links.push('/project/json/' + projects[i].pid);
            }
            res.addData('calheatmap_data', links),
            res.setPath([{name: "Home", url: '/'}, {name: 'APIs', url: '/api'}, {name: api.name}]);
            res.templateRender('api/view', 'API: ' + api.name);
        }
    });
});

module.exports = router;
