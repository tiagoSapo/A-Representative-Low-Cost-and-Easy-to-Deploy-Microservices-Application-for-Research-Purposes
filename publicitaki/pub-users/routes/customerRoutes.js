const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, doesCustomerExists, getCustomerIdByEmail, getCustomerByEmail, updateCustomerByEmail } = require('../controllers/customerController');

router.get('/customers', getAllCustomers);
router.post('/customers/check-exists', doesCustomerExists);

router.get('/customers/:id', getCustomerById);
router.get('/customers/email/:email', getCustomerByEmail); // get customer's ID by email
router.get('/customers/email/:email/id', getCustomerIdByEmail); // get customer's ID by email

router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.put('/customers/email/:email', updateCustomerByEmail);
router.delete('/customers/:id', deleteCustomer);

module.exports = router;
