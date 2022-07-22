const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workSchema = new Schema({
    taskName: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Work', workSchema);
