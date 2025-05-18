const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const auth = require('../middleware/auth');

// Get all companies
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies' });
    }
});

// Search companies
router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        console.log('Company search query:', query);
        
        let searchQuery = {};
        if (query) {
            searchQuery = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { industry: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            };
        }
        
        console.log('Company search query:', searchQuery);
        const companies = await Company.find(searchQuery);
        console.log('Found companies:', companies.length);
        res.json(companies);
    } catch (error) {
        console.error('Company search error:', error);
        res.status(500).json({ message: 'Error searching companies' });
    }
});

// Get company by ID
router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company' });
    }
});

// Create company (protected route)
router.post('/', auth, async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: 'Error creating company' });
    }
});

// Update company (protected route)
router.put('/:id', auth, async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(400).json({ message: 'Error updating company' });
    }
});

// Delete company (protected route)
router.delete('/:id', auth, async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company' });
    }
});

module.exports = router; 