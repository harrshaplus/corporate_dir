const fs = require('fs');
const csv = require('csv-parser');
const Company = require('../models/Company');
const Person = require('../models/Person');
const auth = require('../middleware/auth');

exports.importData = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileType = req.file.mimetype;
        const filePath = req.file.path;
        const importType = req.body.type || 'companies';
        let count = 0;

        if (fileType === 'text/csv') {
            // Handle CSV import
            const results = [];
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => {
                        // Validate required fields for companies
                        if (importType === 'companies' && (!data.name || !data.industry)) {
                            console.warn('Skipping invalid company data:', data);
                            return;
                        }
                        results.push(data);
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            if (importType === 'companies') {
                await Company.insertMany(results);
                count = results.length;
            } else if (importType === 'people') {
                await Person.insertMany(results);
                count = results.length;
            }
        } else if (fileType === 'application/json') {
            // Handle JSON import
            const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log('Raw data:', rawData); // Debug log

            let data = [];
            if (importType === 'companies' && rawData.companies) {
                data = Array.isArray(rawData.companies) ? rawData.companies : [];
            } else if (importType === 'people' && rawData.people) {
                data = Array.isArray(rawData.people) ? rawData.people : [];
            } else {
                data = Array.isArray(rawData) ? rawData : [];
            }

            console.log('Processed data:', data); // Debug log

            if (importType === 'companies') {
                const validCompanies = data.filter(company => company.name && company.industry);
                if (validCompanies.length === 0) {
                    throw new Error('No valid company data found in the file');
                }
                await Company.insertMany(validCompanies);
                count = validCompanies.length;
            } else if (importType === 'people') {
                // For people, we need to find company IDs first
                const peopleData = await Promise.all(data.map(async (person) => {
                    if (!person.name || !person.designation || !person.companyName) {
                        console.warn('Skipping invalid person data:', person);
                        return null;
                    }

                    const company = await Company.findOne({ name: person.companyName });
                    if (!company) {
                        console.warn(`Company not found for person: ${person.name}, company: ${person.companyName}`);
                        return null;
                    }
                    return {
                        ...person,
                        company: company._id
                    };
                }));

                const validPeople = peopleData.filter(person => person !== null);
                if (validPeople.length === 0) {
                    throw new Error('No valid people data found in the file');
                }
                await Person.insertMany(validPeople);
                count = validPeople.length;
            }
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({
            message: 'Data imported successfully',
            count
        });
    } catch (error) {
        console.error('Import error:', error);
        // Clean up file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
        res.status(500).json({ 
            message: 'Error importing data',
            error: error.message 
        });
    }
}; 