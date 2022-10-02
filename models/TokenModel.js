const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    email : {
        type: String
    },
    token : {
        type: String
    },
    created_at: {
        type: Date
    }
});

module.exports = mongoose.model("tokens", tokenSchema, "tokens");