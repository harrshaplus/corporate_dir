const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const personController = require('../controllers/personController');

// Validation middleware
const validatePerson = [
    body('name').notEmpty().withMessage('Name is required'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('contactInfo.email').optional().isEmail().withMessage('Invalid email format'),
    body('contactInfo.phone').optional().matches(/^[0-9+\-\s()]*$/).withMessage('Invalid phone number format')
];

// Routes
router.get('/', personController.getPeople);
router.get('/search', personController.searchPeople);
router.get('/:id', personController.getPersonById);
router.post('/', validatePerson, personController.createPerson);
router.put('/:id', validatePerson, personController.updatePerson);
router.delete('/:id', personController.deletePerson);

module.exports = router; 