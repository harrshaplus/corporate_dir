const Person = require('../models/Person');
const { validationResult } = require('express-validator');

// Get all people with pagination
exports.getPeople = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const people = await Person.find()
            .populate('companies.company', 'name industry')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Person.countDocuments();

        res.json({
            people,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPeople: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching people', error: error.message });
    }
};

// Get person by ID
exports.getPersonById = async (req, res) => {
    try {
        const person = await Person.findById(req.params.id)
            .populate('companies.company', 'name industry contactInfo');
        
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching person', error: error.message });
    }
};

// Create new person
exports.createPerson = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const person = new Person(req.body);
        await person.save();
        res.status(201).json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error creating person', error: error.message });
    }
};

// Update person
exports.updatePerson = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const person = await Person.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error updating person', error: error.message });
    }
};

// Delete person
exports.deletePerson = async (req, res) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);
        
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        res.json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting person', error: error.message });
    }
};

// Search people
exports.searchPeople = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const searchQuery = {
            $text: { $search: query }
        };

        const people = await Person.find(searchQuery)
            .populate('companies.company', 'name industry')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ score: { $meta: "textScore" } });

        const total = await Person.countDocuments(searchQuery);

        res.json({
            people,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalPeople: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching people', error: error.message });
    }
}; 