const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var TechnologySchema = new mongoose.Schema({
    tid: {
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

TechnologySchema.plugin(autoIncrement.plugin, {
    model: 'Technology',
    field: 'tid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Technology = mongoose.model('Technology', TechnologySchema);