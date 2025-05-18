const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');

// Validation middleware
const validateCompany = [
    body('name').notEmpty().withMessage('Company name is required'),
    body('registrationNumber').notEmpty().withMessage('Registration number is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.country').notEmpty().withMessage('Country is required'),
    body('industry').notEmpty().withMessage('Industry is required')
];

// Routes
router.get('/', companyController.getCompanies);
router.get('/search', companyController.searchCompanies);
router.get('/:id', companyController.getCompanyById);
router.post('/', validateCompany, companyController.createCompany);
router.put('/:id', validateCompany, companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

module.exports = router; 