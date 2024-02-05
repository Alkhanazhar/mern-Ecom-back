const { categoryController, updateCategoryController, singleCategoryController, deleteCategoryController, allCategoryController } = require("../controllers/categoryControllers");
const { protectingRoute, isAdmin } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post('/create-category', protectingRoute, isAdmin, categoryController);
router.put('/update-category/:id', protectingRoute, isAdmin, updateCategoryController);
router.get('/get-category', allCategoryController);
router.get('/single-category/:slug', singleCategoryController);
router.delete('/delete-category/:id', deleteCategoryController); 

module.exports = router;