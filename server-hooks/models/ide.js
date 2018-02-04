const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var IDESchema = new mongoose.Schema({
    iid: {
        type: Number,
        unique: true,
        required: true
    },
    key: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

IDESchema.plugin(autoIncrement.plugin, {
    model: 'IDE',
    field: 'iid',
    startAt: 1,
    incrementBy: 1
});

module.exports.IDE = mongoose.model('IDE', IDESchema);