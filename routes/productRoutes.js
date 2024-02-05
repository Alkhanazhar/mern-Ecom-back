const router = require("express").Router();
const { createProductController, getProductController, getSingleProductController, deleteProductController, updateProductController, filterController, getPaymentTokenController, getPaymentController } = require("../controllers/productController");
const { protectingRoute, isAdmin } = require("../middleware/authMiddleware");

router.post('/products', protectingRoute, isAdmin, createProductController);
router.put('/products/:pid', protectingRoute, isAdmin, updateProductController);
router.get('/products', getProductController)
router.get('/products/:slug', getSingleProductController)
router.delete('/products/:id', deleteProductController);
router.post('/products-filter',filterController);

//payment api routes
router.get('/braintree/token', getPaymentTokenController);
router.post('/braintree/payment', getPaymentController);


module.exports = router;
