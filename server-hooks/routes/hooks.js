var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.post('/push', function(req, res, next) {
    console.log(req.body);
    res.json({status: 200});
});

module.exports = router;
