// set up controllers for query searching using req.params instead of hardcoded values
const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const search = 'ab'
    const products = await Product.find({
        name: { $regex: search, $options: 'i' }
    })
    res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
    // specify search queries
    // this setup ignores unspecified search queries 
    const { featured, company, name } = req.query
    const queryObject = {} 

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        // regex allows searching the pattern entered in the query - returns any product with search query pattern
        queryObject.name = { $regex: name, $options: 'i' }
    }

    // search output
    const products = await Product.find(queryObject)
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}