var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'Project'}, {name: 'All'}]);
    res.templateRender('project/all', 'All projects');
});

router.get('/view', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'Project'}, {name: 'View'}]);
    res.templateRender('project/view', 'View project');
});

module.exports = router;
