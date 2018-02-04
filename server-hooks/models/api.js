const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var APISchema = new mongoose.Schema({
    aid: {
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

APISchema.plugin(autoIncrement.plugin, {
    model: 'API',
    field: 'aid',
    startAt: 1,
    incrementBy: 1
});

module.exports.API = mongoose.model('API', APISchema);