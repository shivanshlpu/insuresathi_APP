const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Create a new customer record
router.post('/', async (req, res) => {
  try {
    const { formData } = req.body;
    
    // Extract searchable fields
    const name = formData?.personal?.name || 'Unknown';
    const policyNumber = formData?.personal?.topPolicyNumber || formData?.policy?.policyNumber || '';
    const mobile = formData?.personal?.mobile || '';
    
    // Determine financial year based on current date
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const year = today.getFullYear();
    const financialYear = month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

    const newCustomer = new Customer({
      financialYear,
      searchable: { name, policyNumber, mobile },
      formData
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ error: 'Failed to save customer' });
  }
});

// Get all customers (with optional search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, year } = req.query;
    let query = {};

    if (year) {
      query.financialYear = year;
    }

    if (search) {
      // Case-insensitive regex search on name, policyNumber, or mobile
      const regex = new RegExp(search, 'i');
      query.$or = [
        { 'searchable.name': regex },
        { 'searchable.policyNumber': regex },
        { 'searchable.mobile': regex }
      ];
    }

    // Sort by newest first
    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Update existing customer record
router.put('/:id', async (req, res) => {
  try {
    const { formData } = req.body;
    
    // Extract searchable fields
    const name = formData?.personal?.name || 'Unknown';
    const policyNumber = formData?.personal?.topPolicyNumber || formData?.policy?.policyNumber || '';
    const mobile = formData?.personal?.mobile || '';

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        searchable: { name, policyNumber, mobile },
        formData
      },
      { new: true } // Return updated document
    );

    if (!updatedCustomer) return res.status(404).json({ error: 'Customer not found' });
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

module.exports = router;
