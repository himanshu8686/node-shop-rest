const express = require("express");
const createError = require('http-errors');


const ProductController = require('../Controllers/products.controller');
const multer = require('multer');
const checkAuth = require('../Middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(createError(500, "not in proper format"), false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter

});


const router = express.Router();

/**
 *  getting all Products
 */
router.get('/', ProductController.getAllProducts);

/**
 *  creating a product
 */
router.post('/', checkAuth, upload.single('productImage'), ProductController.createProduct);

/**
 * getting products by id
 */
router.get('/:productId', ProductController.getProductById);

/**
 *  update product by id
 */
router.patch('/:productId', checkAuth, ProductController.updateProductById);

/**
 * delete product by id
 */
router.delete('/:productId', checkAuth, ProductController.deleteProductById);

module.exports = router;