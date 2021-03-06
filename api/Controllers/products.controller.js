const mongoose = require('mongoose');
const Product = require('../Models/Product.model');

/**
 * getting all products
 */
exports.getAllProducts = async (req, res, next) => {
    // res.send('getting lists of all products');
    try {
        const results = await Product.find({}, {
            __v: 0 // field to be omitted 0 here is for remove 1 is for retained
        });

        if (results.length > 0) {
            res.send({
                "response_code": 200,
                "message": "Product fetched successfully",
                "total_results": results.length,
                results
            });
        } else {
            res.status(404).json({
                "response_code": 404,
                "message": "No Product to display",
            });
        }

    } catch (error) {
        console.log(error.message);
        next(createError(res.status, error.message));
    }
};

/**
 *  creating a product
 */
exports.createProduct = async (req, res, next) => {
    console.log("file=>", req.file);
    try {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: `localhost:${process.env.PORT}\\` + req.file.path
        });
        const result = await product.save();
        console.log('From database', result);
        res.send({
            "response_code": 201,
            "message": "Product created successfully",
            result
        });
    } catch (error) {
        console.log(error.message);
        // this Validation error comes from mongoose
        if (error.name === 'ValidationError') {
            next(createError(422, error.message));
            return;
        }
        next(error);
    }
};

/**
 *  getting product by its ID
 */
exports.getProductById = async (req, res, next) => {
    try {
        const id = req.params.productId;
        const product = await Product.findById(id, {
            __v: 0
        });
        if (!product) {
            throw createError(404, "Product does not exist for this id");
        }
        //console.log("from db", product);
        res.send({
            "response_code": 200,
            "message": `Product find with ${id}`,
            product
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'invalid product id'));
            return;
        }
        next(error);
    }

};

/**
 *  updating products by id
 */
exports.updateProductById = async (req, res, next) => {
    // console.log('update product by id');
    try {
        const id = req.params.productId;
        const updates = req.body;
        // options will return the updated product
        const options = {
            new: true
        };

        try {
            const result = await Product.findByIdAndUpdate(id, updates, options);
            if (!result) {
                throw createError(404, "Product does not exist");
            }
            res.send({
                "response_code": 200,
                "message": `Product updated successfully with ${id}`,
                result
            });
        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'invalid product id'));
                return;
            }
            next(error);
        }

    } catch (error) {

    }
};

/**
 *  delete product by Id
 */
exports.deleteProductById = async (req, res, next) => {
    // console.log('delete product by id');
    const id = req.params.productId;
    try {
        const result = await Product.findOneAndDelete({
            _id: id
        });
        if (!result) {
            throw createError(404, 'Product does Not Exist');
        }
        console.log(result);
        res.send({
            "response_code": 200,
            "message": `Product with ${id} deleted`,
            result
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'invalid product id'));
            return;
        }
        next(error);
    }
};