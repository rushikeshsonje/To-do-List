const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const meetSchema = new Schema({
    meetName: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: Number,
        default: '1',
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Meet', meetSchema);
