const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    contactInfo: {
        email: String,
        phone: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    bio: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create text index for search functionality
personSchema.index({
    name: 'text',
    designation: 'text',
    'contactInfo.address.city': 'text',
    'contactInfo.address.country': 'text'
});

module.exports = mongoose.model('Person', personSchema); 