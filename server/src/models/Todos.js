const mongoose = require('mongoose');
const TodoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: [{
        type: String,
        required: false,
    }],
    created_at: {
        type: Date,
        required: true,
    },
    updated_at: {
        type: Date,
        required: false,
    },
    status: {
        type: Boolean,
        required: false,
    },
    completed_at: {
        type: Date,
        required: false
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    }
})
const TodoModel = mongoose.model("todos", TodoSchema)
module.exports = TodoModel