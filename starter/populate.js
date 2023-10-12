require('dotenv').config()

const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany(); // Deletes all the previous data in the model
        await Product.create(jsonProducts)
        
        console.log('Success');
        process.exit(0)// exits the process of node if the try process is successful
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()