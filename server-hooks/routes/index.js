var express = require('express');
var router = express.Router();
var Project = require('../models/project').Project;
var API = require('../models/api').API;
var IDE = require('../models/ide').IDE;
var Tehcnology = require('../models/technology').Technology;

router.get('/', function(req, res, next) {
    res.setPath([{name: "Home"}]);
    res.loadScript('chart');
    var data = [];
    var totalCommits = 0;

    Tehcnology.find().then(function(technology) {
        IDE.find().then(function (ides) {
            API.find().then(function (apis) {
                Project.find().sort({pid: 'desc'}).populate('commits').then(function (projects) {

                    for (var i = 0; i < projects.length; i++) {
                        for (var j = 0; j < projects[i].commits.length; j++) {
                            var date = projects[i].commits[j].date;
                            date.setMinutes(0);
                            date.setSeconds(0);
                            date.setMilliseconds(0);
                            var key = date.getTime();
                            if ((typeof data[key] !== 'undefined')) {
                                data[key]++;
                            } else {
                                data[key] = 1;
                            }
                            totalCommits++;
                        }
                    }
                    var newData = [];
                    var today = new Date();
                    for (var i = 0; i < 24; i++) {
                        var tmpDate = new Date(today.getTime() - (1000 * 60 * 60 * i));
                        tmpDate.setMinutes(0);
                        tmpDate.setSeconds(0);
                        tmpDate.setMilliseconds(0);
                        var tmpKey = tmpDate.getTime();
                        if (typeof data[tmpKey] !== 'undefined') {
                            newData.push(data[tmpKey]);
                        } else {
                            newData.push(0);
                        }
                    }
                    res.addData('charData', newData);
                    res.addData('totalCommits', totalCommits);
                    res.addData('apis', apis);
                    res.addData('ides', ides);
                    res.addData('techs', technology);
                    res.addData('projects', projects);
                    res.templateRender('home/home', 'Welcome page');
                });
            });
        });
    });
});

module.exports = router;
