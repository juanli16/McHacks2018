var express = require('express');
var router = express.Router();
var Project = require('../models/project').Project;

router.get('/', function(req, res, next) {
    res.setPath([{name: "Home"}]);
    res.loadScript('chart');
    var data = [];
    Project.find().populate('commits').then(function(projects){

        for(var i =0; i < projects.length; i++) {
            for(var j=0; j < projects[i].commits.length; j++) {
                var date = projects[i].commits[j].date;
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                var key = date.getTime();
                if((typeof data[key] !== 'undefined')) {
                    data[key]++;
                } else {
                    data[key] = 1;
                }
            }
        }
        var newData = [];
        var today = new Date();
        for(var i=0; i < 24; i++) {
            var tmpDate = new Date(today.getTime() - (1000*60*60*i));
            tmpDate.setMinutes(0);
            tmpDate.setSeconds(0);
            tmpDate.setMilliseconds(0);
            var tmpKey = tmpDate.getTime();
            if(typeof data[tmpKey] !== 'undefined') {
                newData.push(data[tmpKey]);
            } else {
                newData.push(0);
            }
        }
        res.addData('charData', newData);
        res.templateRender('home/home', 'Welcome page');
    });
});

module.exports = router;
