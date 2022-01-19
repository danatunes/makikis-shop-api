const router = require("express").Router();
const stripe = require("stripe")("sk_test_51K6skiHB2Il4qPPW9O83g7xh4FDk3gCDiqbMauPuQi6igvrdfbvR7fXYEjIffyWBFdJgcMHYeC1TYVnfah5Z3kQH00t7lOrj1U");

router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(400).json(stripeErr);
        } else {
            res.status(200).json(stripeRes);
        }
    });
});

module.exports = router;