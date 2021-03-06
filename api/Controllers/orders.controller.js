const Order = require('../Models/Order.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

/**
 *  getting all order
 */
exports.orders_get_all = async (req, res, next) => {
    // console.log('getting all orders');
    try {

        const results = await Order.find({}, {
                __v: 0 // field to be omitted 0 here is for remove 1 is for retained
            })
            .populate('product', {
                __v: 0
            }); // populate fills the product(from product schema 'product') object in orders object
        if (results.length > 0) {
            res.send({
                "response_code": 200,
                "message": "All Order fetched successfully",
                "total_results": results.length,
                results
            });
        } else {
            res.status(404).json({
                "response_code": 404,
                "message": "No Orders to display",
            });
        }
    } catch (error) {
        console.log(error.message);
        next(createError(res.status, error.message));
    }
};

/**
 *  creating order
 */
exports.createOrder = async (req, res, next) => {
    console.log('creating order');

    try {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        const result = await order.save();
        console.log(result);
        res.send({
            "response_code": 201,
            "message": "Order created successfully",
            result
        });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'invalid product id'));
            return;
        } else if (error.name === 'ValidationError') {
            // this Validation error comes from mongoose
            next(createError(422, 'Please provide proper product Id'));
            return;
        }
        next(error);
    }
};

/**
 * getting order by its id
 */
exports.getOrderById = async (req, res, next) => {
    // console.log('getting order by id');
    try {
        const id = req.params.orderId;
        const order = await Order.findById(id, {
                __v: 0
            })
            .populate('product', {
                __v: 0
            });
        if (!order) {
            throw createError(404, "Order does not exist for this id");
        }
        //console.log("from db", product);
        res.send({
            "response_code": 200,
            "message": `Order find with ${id}`,
            order
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'invalid order id'));
            return;
        }
        next(error);
    }
};

/**
 *  delete order by its id 
 */
exports.deleteOrderById = async (req, res, next) => {
    console.log('deleting all order');
    const id = req.params.orderId;
    try {
        const result = await Order.findOneAndDelete({
            _id: id
        });
        if (!result) {
            throw createError(404, 'Order does Not Exist');
        }
        console.log(result);
        res.send({
            "response_code": 200,
            "message": `Order with ${id} deleted`,
            result
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'invalid order id'));
            return;
        }
        next(error);
    }
};