const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fetchUser = require('../middleware/fetchUser');
const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    try {

        // If there are errors, return Bad Request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check whether the user with this email exist already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "sorry a user with this email already exists" })
        }

        const salt = await bcrypt.genSalt(10); // Generates salt
        const secPass = await bcrypt.hash(req.body.password, salt); // Hashing password using salt

        // Create a new User
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        // Send user id in JWT Token
        const jwtData = {
            user: {
                id: user.id
            }
        }

        // Signs given payload into a JWT string payload
       
        const authToken = jwt.sign(jwtData, JWT_SECRET);
        res.json({ authToken });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});







// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a email name').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    try {
        // If there are errors, return Bad Request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructuring
        const { email, password } = req.body;

        // Search user by using email
        let user = await User.findOne({ email });

        // Check whether a user with this email exists or not
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        // Compare password entered by user and encrypted password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        // Send user id in JWT Token
        const jwtData = {
            user: {
                id: user.id
            }
        }

        // Signs given payload into a JWT string payload
        const authToken = jwt.sign(jwtData, JWT_SECRET);
        res.json({ authToken });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }

})




// ROUTE 3: Get loggedin User Details: POST "/api/auth/getuser". Login Required
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;
