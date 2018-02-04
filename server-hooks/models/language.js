const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var LanguageSchema = new mongoose.Schema({
    lid: {
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

LanguageSchema.plugin(autoIncrement.plugin, {
    model: 'Language',
    field: 'lid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Language = mongoose.model('Language', LanguageSchema);