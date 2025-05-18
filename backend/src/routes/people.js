const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const auth = require('../middleware/auth');
const Company = require('../models/Company');

// Get all people
router.get('/', async (req, res) => {
    try {
        const people = await Person.find().populate('company', 'name industry');
        res.json(people);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching people' });
    }
});

// Search people
router.get('/search', async (req, res) => {
    try {
        const { query, company } = req.query;
        console.log('People search params:', { query, company });
        let searchQuery = {};

        if (query) {
            searchQuery = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { designation: { $regex: query, $options: 'i' } },
                    { department: { $regex: query, $options: 'i' } }
                ]
            };
        }

        if (company) {
            // First find the company by name
            const companyDoc = await Company.findOne({ name: company });
            console.log('Found company:', companyDoc);
            if (companyDoc) {
                searchQuery.company = companyDoc._id;
            } else {
                console.log('Company not found:', company);
                return res.json([]); // Return empty array if company not found
            }
        }

        console.log('Final people search query:', searchQuery);
        const people = await Person.find(searchQuery).populate('company', 'name industry');
        console.log('Found people:', people.length);
        res.json(people);
    } catch (error) {
        console.error('People search error:', error);
        res.status(500).json({ message: 'Error searching people' });
    }
});

// Get person by ID
router.get('/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id).populate('company', 'name industry');
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching person' });
    }
});

// Create person (protected route)
router.post('/', auth, async (req, res) => {
    try {
        const person = new Person(req.body);
        await person.save();
        res.status(201).json(person);
    } catch (error) {
        res.status(400).json({ message: 'Error creating person' });
    }
});

// Update person (protected route)
router.put('/:id', auth, async (req, res) => {
    try {
        const person = await Person.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.json(person);
    } catch (error) {
        res.status(400).json({ message: 'Error updating person' });
    }
});

// Delete person (protected route)
router.delete('/:id', auth, async (req, res) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting person' });
    }
});

module.exports = router; 