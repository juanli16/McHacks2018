const constants = {

};

function loadConstants(req, res, next) {
    res.addData('g_constant', constants);
    next();
}

module.exports.loadConstants = loadConstants;
module.exports.STATIC = constants;
