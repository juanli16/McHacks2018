const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var ProjectSchema = new mongoose.Schema({
    pid: {
        type: Number,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    os: {
        type: String
    },
    language: {
        type: String
    },
    commits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commit'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ProjectSchema.plugin(autoIncrement.plugin, {
    model: 'Project',
    field: 'pid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Project = mongoose.model('Project', ProjectSchema);