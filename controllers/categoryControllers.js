// const { default: slugify } = require("slugify");
const slugify = require("slugify");
const Category = require("../models/Category");

module.exports.categoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(404).send({ message: "no name specified" });
        const ifExists = await Category.findOne({ name })
        if (ifExists) {return res.status(200).send({ message: "already exists" })}
        const category = new Category({ name: name, slug: slugify( name ) })
        await category.save()
        res.status(200).send({ message: "category saved successfully", category });
    } catch (error) {
        console.log("category saved error", error.message)
        res.status(500).send({ message: error.message });
    }

}
module.exports.updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params
        await Category.findByIdAndUpdate(id, { name, slug:slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: "Category Updated SuccessFully"
        })
    } catch (error) {
        console.log("category updated error", error.message)
        res.status(500).send({ message: error.message });
    }
   
}
module.exports.allCategoryController = async (req, res) => {
    try {
        const category = await Category.find({})
        res.status(200).send({
            success: "true",
            message: "All category list",
            category
        })
    } catch (error) {
        console.log("Error while getting all categories")
        res.status(500).send({ message: "Error while getting all categories"});
    }
}
module.exports.singleCategoryController = async (req, res) => {
    try {
        const category = await Category.findById({ slug: req.params.slug})
        res.status(200).send({
            success: "true",
            message: "",
            category
        })
    } catch (error) {
        console.log("Error while getting all categories")
        res.status(500).send({ message: "Error while getting all categories" })

    }
}
module.exports.deleteCategoryController = async (req, res) => {
    try {
        await Category.findByIdAndDelete( req.params.id )
        res.status(200).send({ status: true, message: "Category updated" })
        
    } catch (error) {
        console.log("cant",error.message)
        res.status(500).send({message: error.message})
    }
 
}