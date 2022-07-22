const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workDoneSchema = new Schema({
    doneTask: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: new Date()
    },
    time: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('workDone', workDoneSchema);
