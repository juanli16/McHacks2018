var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Console = require('../models/console').Console;
var Project = require('../models/project').Project;
var Commit = require('../models/commit').Commit;

router.post('/push', function(req, res, next) {
    var json = req.body;
    // Create project
    Project.remove({hash: json.id}).then(function(){
        var project  = new Project({hash: json.id, name: json.name, os: json.os});
        project.save().then(function () {
            // Find project
            Project.findOne({hash: json.id}).then(function(project) {
                // TODO Delete old commits from DB
                project.commits = [];
                for(var i=0; i < json.commit.length; i++) {
                    var commit = json.commit[i];
                    var commitObj = new Commit({
                        message: commit.message,
                        hash: commit.id,
                        author: commit.author_name + " <" + commit.author_email +">",
                        date: new Date(commit.date)});
                    commitObj.save();
                    project.commits.push(commitObj);
                }
                project.save().then(function(){
                    Console.find().sort({cid: 'desc'}).limit(1).then(function(consoles){
                        res.set({ 'content-type': 'application/json; charset=utf-8' })
                        if(consoles.length === 1) {
                            res.send(consoles[0].consoleMessage());
                        } else {
                            res.send("");
                        }
                    });
                }).catch(function(reason){
                    res.send('error');
                });
            });
        }).catch(function (reason) {
            res.send('error');
        });
    });
});

module.exports = router;
