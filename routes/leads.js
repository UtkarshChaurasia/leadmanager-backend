const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Lead = require('../models/Lead');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get all the leads using: GET "api/leads/getleads". Login required
router.get('/fetchallleads', fetchUser, async (req, res) => {

    try {
        // Find leads of user with given user id
        const leads = await Lead.find({ user: req.user.id });
        res.json(leads);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 2: Add new Lead using: POST "api/leads/addlead". Login required
router.post('/addlead', fetchUser, [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('description', 'Enter a valid description').isLength({ min: 5 }),
], async (req, res) => {

    try {
        // If there are errors, return Bad Request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructuring
        const { name, email, description, tag } = req.body;

        // Create new lead
        const lead = new Lead({
            name, email, description, tag, user: req.user.id
        });

        const savedLead = await lead.save();
        res.json(savedLead);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router