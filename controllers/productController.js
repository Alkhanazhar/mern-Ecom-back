const { default: slugify } = require("slugify");
const Product = require("../models/Product");
const fs = require("fs");
const braintree = require("braintree");
const Order = require("../models/Order");
require('dotenv').config()
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAIN_TREE_MERCHANT_ID,
    publicKey: process.env.BRAIN_TREE_PUBLIC_KEY,
    privateKey: process.env.BRAIN_TREE_PRIVATE_KEY,
});


module.exports.createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, photo, shipping } = req.body;
        switch (true) {
            case (!name):
                return res.status(500).send({ message: "name is required" });
            case (!description):
                return res.status(500).send({ message: "description is required" });
            case (!price):
                return res.status(500).send({ message: "price is required" });
            case (!category):
                return res.status(500).send({ message: "category is required" });
            case (!photo):
                return res.status(500).send({ message: "photo is not found" });
        }
        const product = new Product({ name, slug: slugify(name), description, price, category, quantity, photo, shipping })
        await product.save()
        res.status(200).send({
            message: "Product saved successfully", product
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: error.message });
    }
}
module.exports.getProductController = async (req, res) => {
    try {
        const products = await Product.find({}).populate("category").sort({ createdAt: -1 })
        res.status(200).send({
            success: true, products
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: error.message });
    }
};
module.exports.getSingleProductController = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
        res.status(200).send({
            message: "single product fetched",
            product
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: error.message });
    }
}
module.exports.deleteProductController = async (req, res) => {
    try {
        const { id } = req.params
        await Product.findByIdAndDelete(id)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: error.message })
    }
}
module.exports.updateProductController = async (req, res) => {
    try {
        const { pid } = req.params
        const { name, description, price, category, quantity, photo, shipping } = req.body;
        switch (true) {
            case (!name):
                return res.status(500).send({ message: "name is required" });
            case (!description):
                return res.status(500).send({ message: "description is required" });
            case (!price):
                return res.status(500).send({ message: "price is required" });
            case (!category):
                return res.status(500).send({ message: "category is required" });
            case (!photo):
                return res.status(500).send({ message: "photo is not found" });
        }
        const product = await Product.findByIdAndUpdate(pid, { name, slug: slugify(name), description, price, category, quantity, photo, shipping })
        res.status(200).send({
            message: "updated successfully", product
        })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "cannot update product" });
    }
}
module.exports.filterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        console.log(checked, radio)
        let args = {}
        if (checked.length > 0) {
            args.category = checked
        }
        if (radio.length) {
            args.price = { $gte: radio[0], $lte: radio[1] }
        }
        const filterProducts = await Product.find(args)
        console.log(filterProducts)
        res.status(200).send({ success: "Product updated", filterProducts })

    } catch (error) {
        res.status(500).send({ success: false, message: "cannot find any filtered products" });
        console.log(error.message);
    }
}

module.exports.getPaymentTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.getPaymentController = (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransActions = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new Order({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            })
    } catch (error) {
        console.log(error.message);
    }
}
module.exports.getAllOrdersController = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("products")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};