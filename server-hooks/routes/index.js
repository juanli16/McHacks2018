var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.setPath([{name: "Home"}]);
    res.templateRender('home/home', 'Welcome page');
});

router.post('/', function(req, res) {
	console.log("You are receiving!")
	console.log(req.body)
	res.send()
})

module.exports = router;
