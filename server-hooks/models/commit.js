const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var CommitSchema = new mongoose.Schema({
    cid: {
        type: Number,
        unique: true,
        required: true
    },
    message: {
        type: String
    },
    author: {
        type: String
    },
    hash: {
        type: String
    },
    date: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

CommitSchema.plugin(autoIncrement.plugin, {
    model: 'Commit',
    field: 'cid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Commit = mongoose.model('Commit', CommitSchema);