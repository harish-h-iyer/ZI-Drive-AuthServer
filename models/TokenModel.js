const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    Token : {
        type: String
    },
    created_at: {
        type: Date
    }
});

module.exports = mongoose.model("tokens", tokenSchema, "tokens");