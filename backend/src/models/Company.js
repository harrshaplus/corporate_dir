const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    contactInfo: {
        email: String,
        phone: String,
        website: String
    },
    foundedYear: Number,
    employeeCount: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create text index for search functionality
companySchema.index({ 
    name: 'text',
    'address.city': 'text',
    'address.country': 'text',
    industry: 'text'
});

module.exports = mongoose.model('Company', companySchema); 