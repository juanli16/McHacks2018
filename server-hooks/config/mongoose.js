var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;
var connection = mongoose.connect(process.env.MONGODB_URI);
autoIncrement.initialize(connection);

module.exports.mongoose = mongoose;