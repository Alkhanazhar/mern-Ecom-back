const { registerController, loginController, updateProfileController, getOrdersController } = require("../controllers/authControllers");
const { protectingRoute, isAdmin } = require("../middleware/authMiddleware");
const { getAllOrdersController } = require("../controllers/productController");

const router = require("express").Router();

router.post("/register", registerController)
router.post("/login", loginController)
//protected route
router.get("/protect", protectingRoute, (req, res) => {
    res.status(200).send({ ok: true })
})
router.get("/admin-protect", protectingRoute, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

router.put("/profile", protectingRoute, updateProfileController);
router.get("/orders", protectingRoute, getOrdersController);
router.get("/all-orders", protectingRoute, isAdmin, getAllOrdersController);



module.exports = router