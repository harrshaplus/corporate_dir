const fs = require('fs');
const csv = require('csv-parser');
const Company = require('../models/Company');
const Person = require('../models/Person');

class ImportService {
    static async importCSV(filePath, type) {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    try {
                        if (type === 'company') {
                            await this.processCompanyData(results);
                        } else if (type === 'person') {
                            await this.processPersonData(results);
                        }
                        resolve({ message: `Successfully imported ${results.length} records` });
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => reject(error));
        });
    }

    static async importJSON(filePath, type) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            if (type === 'company') {
                await this.processCompanyData(data);
            } else if (type === 'person') {
                await this.processPersonData(data);
            }

            return { message: `Successfully imported ${data.length} records` };
        } catch (error) {
            throw new Error(`Error importing JSON: ${error.message}`);
        }
    }

    static async processCompanyData(data) {
        const companies = data.map(item => ({
            name: item.name,
            registrationNumber: item.registrationNumber,
            address: {
                street: item.street,
                city: item.city,
                state: item.state,
                country: item.country,
                postalCode: item.postalCode
            },
            contactInfo: {
                phone: item.phone,
                email: item.email,
                website: item.website
            },
            industry: item.industry,
            incorporationDate: item.incorporationDate,
            financialInfo: {
                revenue: item.revenue,
                employees: item.employees,
                foundedYear: item.foundedYear
            },
            status: item.status || 'Active'
        }));

        await Company.insertMany(companies, { ordered: false });
    }

    static async processPersonData(data) {
        const people = data.map(item => ({
            name: item.name,
            designation: item.designation,
            contactInfo: {
                email: item.email,
                phone: item.phone,
                address: {
                    street: item.street,
                    city: item.city,
                    state: item.state,
                    country: item.country,
                    postalCode: item.postalCode
                }
            },
            professionalHistory: item.professionalHistory || [],
            status: item.status || 'Active'
        }));

        await Person.insertMany(people, { ordered: false });
    }

    static cleanupFile(filePath) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Error cleaning up file:', error);
        }
    }
}

module.exports = ImportService; 