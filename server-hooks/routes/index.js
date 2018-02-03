var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.setPath([{name: "Home"}]);
    res.templateRender('home/home', 'Welcome page');
});

module.exports = router;
