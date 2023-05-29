const express = require('express');
const router = express.Router();
const { getAllStores, getStoreById, createStore, updateStore, deleteStore, getStoreSubscriptions, createStoreSubscription, doesStoreExists, getStoreByEmail, getStoreIdByEmail, updateStoreByEmail } = require('../controllers/storeController');

// Define routes for Store entity
router.get('/stores', getAllStores);

router.get('/stores/:id', getStoreById);
router.get('/stores/email/:email', getStoreByEmail); // get store by email
router.get('/stores/email/:email/id', getStoreIdByEmail); // get store's ID by email

router.post('/stores/check-exists', doesStoreExists); // check store's email and password
router.post('/stores', createStore);
router.put('/stores/:id', updateStore);
router.put('/stores/email/:email', updateStoreByEmail);
router.delete('/stores/:id', deleteStore);

// Routes to get, create and update Store's Subscriptions
router.get('/stores/:id/subscriptions', getStoreSubscriptions);
router.post('/stores/:id/subscriptions', createStoreSubscription);

module.exports = router;

