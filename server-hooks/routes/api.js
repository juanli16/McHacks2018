var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.setPath([{name: "Home", url: '/'}, {name: 'API'}]);
    res.templateRender('api/all', 'API');
});

module.exports = router;
