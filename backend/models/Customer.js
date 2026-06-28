const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  financialYear: {
    type: String,
    required: true,
    index: true
  },
  searchable: {
    name: { type: String, index: true },
    policyNumber: { type: String, index: true },
    mobile: { type: String, index: true }
  },
  formData: {
    type: Object, // We can store the entire complex nested JSON here
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
