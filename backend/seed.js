const mongoose = require('mongoose');
require('dotenv').config();
const Customer = require('./models/Customer');

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = [
  {
    financialYear: '2025-2026',
    searchable: { name: 'Rahul Sharma', policyNumber: 'LIC-9081234', mobile: '9876543210' },
    formData: {
      personal: { name: 'Rahul Sharma', mobile: '9876543210', dob: '1985-06-15' },
      policy: { policyNumber: 'LIC-9081234' }
    },
    createdAt: new Date('2025-05-10T10:00:00Z')
  },
  {
    financialYear: '2025-2026',
    searchable: { name: 'Priya Patel', policyNumber: 'LIC-1122334', mobile: '9123456780' },
    formData: {
      personal: { name: 'Priya Patel', mobile: '9123456780', dob: '1990-11-20' },
      policy: { policyNumber: 'LIC-1122334' }
    },
    createdAt: new Date('2025-08-21T14:30:00Z')
  },
  {
    financialYear: '2024-2025',
    searchable: { name: 'Amit Kumar', policyNumber: 'HDFC-5544332', mobile: '9988776655' },
    formData: {
      personal: { name: 'Amit Kumar', mobile: '9988776655', dob: '1978-02-05' },
      policy: { policyNumber: 'HDFC-5544332' }
    },
    createdAt: new Date('2024-11-15T09:15:00Z')
  },
  {
    financialYear: '2022-2023',
    searchable: { name: 'Neha Gupta', policyNumber: 'SBI-7766554', mobile: '9811223344' },
    formData: {
      personal: { name: 'Neha Gupta', mobile: '9811223344', dob: '1995-08-30' },
      policy: { policyNumber: 'SBI-7766554' }
    },
    createdAt: new Date('2022-12-05T11:45:00Z')
  },
  {
    financialYear: '2009-2010',
    searchable: { name: 'Sanjay Verma', policyNumber: 'LIC-1239988', mobile: '9001122334' },
    formData: {
      personal: { name: 'Sanjay Verma', mobile: '9001122334', dob: '1965-04-12' },
      policy: { policyNumber: 'LIC-1239988' }
    },
    createdAt: new Date('2009-06-20T10:00:00Z')
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Inserting seed data...');
    
    // Optional: Clear existing data first
    // await Customer.deleteMany({});
    
    await Customer.insertMany(seedData);
    console.log('Seed data inserted successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedDatabase();
