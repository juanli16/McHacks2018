const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var _ = require('lodash');

var ConsoleSchema = new mongoose.Schema({
    cid: {
        type: Number,
        unique: true,
        required: true
    },
    token: {
        type: String
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ConsoleSchema.plugin(autoIncrement.plugin, {
    model: 'Console',
    field: 'cid',
    startAt: 1,
    incrementBy: 1
});

ConsoleSchema.methods.consoleMessage = function() {
    var message = "";
    if(!_.isEmpty(this.token)) {
        message += this.token;
    } else {
        message += "No token :(";
    }
    message += "\n\n------------------------------\n\n";
    if(!_.isEmpty(this.message)) {
        message += this.message;
    } else {
        message += "No new message"
    }
    return message;
};

module.exports.Console = mongoose.model('Console', ConsoleSchema);