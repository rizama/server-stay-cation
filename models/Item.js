const mongoose = require("mongoose");
const { Objectid } = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: "Indonesia"
    },
    city: {
        type: String,
        required: true
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: Objectid,
        ref: 'Category'
    },
    imageId: {
        type: Objectid,
        ref: 'Image'
    },
    featureId: {
        type: Objectid,
        ref: 'Feature'
    },
    activityId: {
        type: Objectid,
        ref: 'Activity'
    },

});

module.exports = mongoose.model("Item", itemSchema);