const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide product name'],
        trim: true,
        maxlength: [20, 'Name cannot be more than 20 characters']
    },
    price: {
        type: Number,
        required: [true, 'Must provide product price']
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    company: {
        type: String,
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported' // sets custom error message if entered company is not a value
        }
    }
})

module.exports = mongoose.model('Product', productSchema)