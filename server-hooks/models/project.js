const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var ProjectSchema = new mongoose.Schema({
    pid: {
        type: Number,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ProjectSchema.plugin(autoIncrement.plugin, {
    model: 'Project',
    field: 'qid',
    startAt: 1,
    incrementBy: 1
});

module.exports. = mongoose.model('ProjectSchema', ProjectSchema);