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
            } else if (importType === 'people') {
                await Person.insertMany(results);
            }
            count = results.length;
        } else if (fileType === 'application/json') {
            // Handle JSON import
            const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let data = rawData;

            // Handle nested data structure
            if (importType === 'companies' && rawData.companies) {
                data = rawData.companies;
            } else if (importType === 'people' && rawData.people) {
                data = rawData.people;
            }

            // Validate data before insertion
            if (importType === 'companies') {
                data = data.filter(company => company.name && company.industry);
                if (data.length === 0) {
                    throw new Error('No valid company data found in the file');
                }
                await Company.insertMany(data);
            } else if (importType === 'people') {
                await Person.insertMany(data);
            }
            count = data.length;
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