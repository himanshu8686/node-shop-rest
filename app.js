const express = require("express");
const createError = require('http-errors');
const dotenv = require('dotenv').config();
const productRoutes = require('./api/Routes/products');
const orderRoutes = require('./api/Routes/orders');
const userRoutes = require('./api/Routes/user');
const app = express();

console.log(dotenv.parsed);

//middleware for raw request
app.use(express.json());

//middleware for form-url-encoded request
app.use(express.urlencoded({
    extended: true
}));

//MongoDB initialised
require('./initDB')();

// Server config
const PORT = process.env.PORT || 3000;

app.use('/uploads', express.static('uploads'));

//CORS error message handle middleware before routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.send();
    }
    next();
});

// Routes for handling requests 
app.use('/products', productRoutes);

app.use('/orders', orderRoutes);

app.use('/users', userRoutes);


// middleware to check if url is correct or not
app.use((req, res, next) => {
    // const err = new Error("Not Found");
    // err.status = 404;
    // next(err);

    // OR by http-errors
    next(createError(404, 'Not-Found'));

});

//Error Handler for whole app in which next(err) is responsible for sending err message in whole of the app
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        response_code: err.status || 500,
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
});