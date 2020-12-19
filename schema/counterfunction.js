
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CounterSchema = new Schema({
    _id: {
        type: String
    },
    sequence_value: {
        type: Number
    }
});
module.exports = mongoose.model("counter", CounterSchema, "counter");