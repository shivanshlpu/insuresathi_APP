const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiter for form submissions (max 10 per hour per IP)
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many submissions from this IP, please try again after an hour' }
});

// Helper function to escape special regex characters to prevent ReDoS
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Create a new customer record (Public with rate limit)
router.post('/', submitLimiter, async (req, res) => {
  try {
    const { formData } = req.body;
    if (!formData || typeof formData !== 'object') {
      return res.status(400).json({ error: 'Invalid form data' });
    }
    
    // Extract searchable fields
    const name = formData?.personal?.name || 'Unknown';
    const policyNumber = formData?.personal?.topPolicyNumber || formData?.policy?.policyNumber || '';
    const mobile = formData?.personal?.mobile || '';
    
    // Determine financial year based on document date (fallback to current date)
    const docDateStr = formData?.personal?.docDate || formData?.policy?.docDate;
    if (docDateStr) {
      if (!formData.personal) formData.personal = {};
      if (!formData.policy) formData.policy = {};
      formData.personal.docDate = docDateStr;
      formData.policy.docDate = docDateStr;
    }
    const targetDate = (docDateStr && !isNaN(new Date(docDateStr).getTime())) 
      ? new Date(docDateStr) 
      : new Date();
    const month = targetDate.getMonth() + 1; // 1-12
    const year = targetDate.getFullYear();
    const financialYear = month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

    const source = req.body.source === 'client' ? 'client' : 'agent';
    const status = source === 'client' ? 'new' : 'reviewed';

    const newCustomer = new Customer({
      financialYear,
      docDate: targetDate,
      searchable: { name, policyNumber, mobile },
      formData,
      source,
      status
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ error: 'Failed to save customer' });
  }
});

// === PROTECTED ROUTES BELOW ===
router.use(authMiddleware);

// Bulk import customer records (Protected Admin route)
router.post('/bulk-import', async (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty records array' });
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const raw of records) {
      const personal = raw.formData?.personal || raw.personal || {};
      const policy = raw.formData?.policy || raw.policy || {};
      const name = personal.name || raw.searchable?.name || 'Unknown';
      const policyNumber = policy.policyNumber || policy.docNumber || personal.topPolicyNumber || raw.searchable?.policyNumber || '';
      const mobile = personal.mobile || raw.searchable?.mobile || '';

      const docDateStr = policy.docDate || personal.docDate || '';
      const targetDate = (docDateStr && !isNaN(new Date(docDateStr).getTime())) 
        ? new Date(docDateStr) 
        : new Date();
      const month = targetDate.getMonth() + 1;
      const year = targetDate.getFullYear();
      const financialYear = raw.financialYear || (month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`);

      const recordData = {
        financialYear,
        docDate: targetDate,
        searchable: { name, policyNumber, mobile },
        formData: raw.formData || raw,
        source: raw.source || 'agent',
        status: raw.status || 'reviewed'
      };

      let query = {};
      if (policyNumber && policyNumber !== 'N/A') {
        query = { 'searchable.policyNumber': policyNumber };
      } else if (mobile) {
        query = { 'searchable.name': name, 'searchable.mobile': mobile };
      } else {
        query = { 'searchable.name': name };
      }

      const existing = await Customer.findOne(query);
      if (existing) {
        await Customer.updateOne(query, { $set: recordData });
        updatedCount++;
      } else {
        await Customer.create(recordData);
        insertedCount++;
      }
    }

    res.json({ message: 'Bulk import successful', insertedCount, updatedCount, total: insertedCount + updatedCount });
  } catch (error) {
    console.error('Error during bulk import:', error);
    res.status(500).json({ error: 'Failed to perform bulk import' });
  }
});

// Get all customers (with optional search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, year } = req.query;
    let query = {};

    if (year) {
      query.financialYear = String(year);
    }

    if (search && typeof search === 'string') {
      // Escaped case-insensitive regex search to prevent ReDoS
      const safeSearch = escapeRegex(search.trim());
      const regex = new RegExp(safeSearch, 'i');
      query.$or = [
        { 'searchable.name': regex },
        { 'searchable.policyNumber': regex },
        { 'searchable.mobile': regex }
      ];
    }


    // Sort by Document Date (newest first), fallback to updatedAt/createdAt
    const customers = await Customer.find(query)
      .select('-formData.personal.photo')
      .limit(500)
      .sort({ docDate: -1, updatedAt: -1, createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get count of unread (new) client submissions
router.get('/unread-count', async (req, res) => {
  try {
    const unreadRecords = await Customer.find({ status: 'new' }).select('searchable.name').lean();
    const count = unreadRecords.length;
    const names = unreadRecords.map(r => r.searchable?.name || 'Unknown');
    res.json({ count, names });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Get all unread notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Customer.find({ status: 'new' })
      .select('searchable.name createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
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
    
    // Determine financial year based on document date (fallback to current date)
    const docDateStr = formData?.personal?.docDate || formData?.policy?.docDate;
    if (docDateStr) {
      if (!formData.personal) formData.personal = {};
      if (!formData.policy) formData.policy = {};
      formData.personal.docDate = docDateStr;
      formData.policy.docDate = docDateStr;
    }
    const targetDate = (docDateStr && !isNaN(new Date(docDateStr).getTime())) 
      ? new Date(docDateStr) 
      : new Date();
    const month = targetDate.getMonth() + 1; // 1-12
    const year = targetDate.getFullYear();
    const financialYear = month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

    // Extract searchable fields
    const name = formData?.personal?.name || 'Unknown';
    const policyNumber = formData?.personal?.topPolicyNumber || formData?.policy?.policyNumber || '';
    const mobile = formData?.personal?.mobile || '';

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        financialYear,
        docDate: targetDate,
        searchable: { name, policyNumber, mobile },
        formData,
        status: 'reviewed' // Always mark as reviewed when updated by agent
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

// Mark as reviewed
router.patch('/:id/reviewed', async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, { status: 'reviewed' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
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
