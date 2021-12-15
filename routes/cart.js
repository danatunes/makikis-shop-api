const router = require("express").Router();
const Cart = require("../models/Cart");
const {verifyTokenAndAuth, verifyTokenAndAdmin} = require("../middleware/verifyToken");


router.post("/", async (req, res) => {

    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (e) {
        res.status(400).json(e)
    }
})

//Update
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedCart);
    } catch (e) {
        res.status(400).json(e);
    }
})

//Delete
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("deleted");
    } catch (e) {
        res.status(400).json(e);
    }
})

//Get
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all
router.get("/", verifyTokenAndAdmin,async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts);
    } catch (e) {
        res.status(400).json(e);
    }
});


module.exports = router;