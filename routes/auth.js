const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//registration
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
    });

    await newUser.save()
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json('Error: ' + err));

});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password &&
        res.status(401).json("Wrong password");

        const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            }, process.env.JWT_SECRET,
            {expiresIn: "3d"});

        const {password, ...others} = user._doc;

        res.status(200).json({others, accessToken});
    } catch (e) {
        res.status(401).json(e);
    }
});

module.exports = router;