const Product = require('../models/product')

//Base
// const getAllProductsStatic = async (req,res) => {
//     const products = await Product.find({}).sort('name').select('name price')
//     res.status(200).json({ nbHits: products.length, products })
// }

//Finding test
// const getAllProductsStatic = async (req,res) => {
//     const products = await Product.find({
//         featured: true 
//     })
//     res.status(200).json({ nbHits: products.length, products })
// }

//Sorting test
// const getAllProductsStatic = async (req,res) => {
//     const products = await Product.find({}).sort('-name price')
//     res.status(200).json({ nbHits: products.length, products })
// }

//Selecting test (particular fields)
// const getAllProductsStatic = async (req,res) => {
//     const products = await Product.find({}).select('name price')
//     res.status(200).json({ nbHits: products.length, products })
// }

//Limiting test (certain data)
// const getAllProductsStatic = async (req,res) => {
//     const products = await Product.find({})
//         .sort('name')
//         .select('name price')
//         .limit(10)
//         .skip(1) // skips certain number of product starting from first one.
//     res.status(200).json({ nbHits: products.length, products })
// }

//Nummeric Filter
const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({ price: { $gt: 30 }}) //finds prices which are greater than 30
        .sort('price')
        .select('name price')
    res.status(200).json({ nbHits: products.length, products })
}

//Dynamic usecase
const getAllProducts = async (req,res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true'? true : false
    }

    if(company) {
        queryObject.company = company
    }

    if(name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }

    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$gt',
        }
        const regEx = /\b(<|>|>=|<=|=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match)=>`-${operatorMap[match]}-`
        )
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item)=>{
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
        console.log(numericFilters)
        // console.log(filters)
    }

    console.log(queryObject)

    let result = Product.find(queryObject);

    //sort
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
        // console.log(sort);
        // console.log(sortList);
        // Example: if price is the value it will arrange the data from lowest price to highest and 
        //          -price arranges the data from highest price to lowest
    }

    //select (particular fields)
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
        // console.log(fields);
        // console.log(fieldsList);
    }
    
    // else{
    //     result = result.sort('createAt')
    // }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page -1) * limit;

    result = result.skip(skip).limit(limit)
    //23 products
    // 23 / 7 products per page = 4 (7 + 7 + 7 + 2)

    const products = await result

    res.status(200).json({ nbHits: products.length, products })
    
    // console.log(req.query)
    // console.log(`nbHits: ${products.length}`)
}

module.exports = {
    getAllProductsStatic, 
    getAllProducts
}