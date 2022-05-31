// set up controllers for query searching using req.params instead of hardcoded values
const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const search = 'ab'
    const products = await Product.find({price: {$gt: 30}})
        .sort('price')
        .select('name price')
    res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
    // specify search queries
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {} 

    // string filtering
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

    // numeric filtering
    if (numericFilters) {
        // replacing operators for mongoose syntax
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte'
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        // console.log(filters);

        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    // sort
    let result = Product.find(queryObject)

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }

    // select (fields - custom name)
    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList) 
    }

    // page (using skip) & limit
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    // search output
    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}