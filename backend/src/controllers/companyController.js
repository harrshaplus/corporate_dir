const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// Get all companies with pagination
exports.getCompanies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const companies = await Company.find()
            .populate('directors', 'name designation')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Company.countDocuments();

        res.json({
            companies,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCompanies: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error: error.message });
    }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
            .populate('directors', 'name designation contactInfo');
        
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error: error.message });
    }
};

// Create new company
exports.createCompany = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error creating company', error: error.message });
    }
};

// Update company
exports.updateCompany = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error updating company', error: error.message });
    }
};

// Delete company
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company', error: error.message });
    }
};

// Search companies
exports.searchCompanies = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const searchQuery = {
            $text: { $search: query }
        };

        const companies = await Company.find(searchQuery)
            .populate('directors', 'name designation')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ score: { $meta: "textScore" } });

        const total = await Company.countDocuments(searchQuery);

        res.json({
            companies,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalCompanies: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching companies', error: error.message });
    }
}; 