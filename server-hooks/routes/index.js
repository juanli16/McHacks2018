var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.setPath([{name: "Home"}]);
    res.loadScript('chart');
    res.addData('charData', [65,59,80,81,56,55,65,59,80,81,56,55,65,59,80,81,56,55,65,59,80,81,56,55]);
    res.templateRender('home/home', 'Welcome page');
});

module.exports = router;
