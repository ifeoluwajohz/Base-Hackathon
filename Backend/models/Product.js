const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');


const productSchema = new mongoose.Schema({
    ProductName : {
        type: String,
        required: true,
    },
    ProductDetail : {
        type: String,
        required: true,
    },
    ProductPrice : {
        type: String,
        required: true,
    },
    ImageUrl : {
        type: String,
    },
    ProductSize : {
        type: String,
    },
    Category: { 
        type: String, 
        required: true 
    },
    ratings: [{ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to user who rated
        value: { type: Number, min: 1, max: 5 } // Rating value (1 to 5, for example)
    }],
    Tags: [{
        type: String 
    }],
    Comments: [{ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to user who commented
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    
    // Quantity : [{ 
    //     user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to user who commented
    //     value: { type: String },
    // }]


})


const Product = mongoose.model('product', productSchema);
module.exports = Product;
