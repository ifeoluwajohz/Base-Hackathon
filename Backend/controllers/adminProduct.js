require('dotenv').config();

const Admin = require('../models/Admin');
const Product = require('../models/Product')



//get all products
module.exports.products_get = async (req, res) => {
    try{
        const products = await Product.find()
        res.status(201).json({product : products})
    }catch(err){
        console.log({err: err.message})
        res.status(400).json({err: err.message}, "An error occured")
    }
}

// Get a particular product

module.exports.product_get = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        let query = {};
    
        if (searchTerm) {
          query = {
            $or: [
              { ProductName: { $regex: searchTerm, $options: 'i' } },
              { ProductDetail: { $regex: searchTerm, $options: 'i' } },
              { Category: { $regex: searchTerm, $options: 'i' } },
            ],
          };
        }
    
        const products = await Product.find(query);
        res.json(products);
      }
     catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Post a product

module.exports.product_post = async (req, res) => {
    const { ProductName, ProductDetail, ProductPrice, Category } = req.body;
    // const { adminId } = req.body;

    try {
        // const findId = Product.findById(adminId);

        // if(findId) {
        //     return res.status(404).json({message: "The AdminId is not correct"})
        // }
        // Check if the requesting user is an admin
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Only admins can add products' });
        // }
        if(isNaN(parseFloat(ProductPrice))){
            return res.status(400).json({ message: "Invalid price value"})
        }

        const newProduct = new Product({
            ProductName,
            ProductDetail,
            ProductPrice,
            Category
        });

        // Save the product to the database
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

// Patch a particular product

module.exports.product_patch = async (req, res) => {
    const productId = req.params.productId;
    const updates = req.body; // Assuming updates are sent in the request body

    try {
        // Find the product by ID and update it
        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: "Product Updated Successfully", updatedProduct});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Delete a particular product

module.exports.product_delete = async (req, res) => {
    const productId = req.params.productId;

    try {
        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.messsage });
    }
}