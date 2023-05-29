const express = require('express');
const router = express.Router();
const { getAllSubscriptions, getSubscriptionById, deleteSubscription, postSubscription, getStoreSubscription, createSubscription, paySubscription } = require('../controllers/subscriptionController');

// Define routes for Subscription entity
router.get('/subscriptions', getAllSubscriptions);
router.get('/subscriptions/:id', getSubscriptionById);

router.post('/subscriptions/', postSubscription);

router.delete('/subscriptions/:id', deleteSubscription);



router.get('/subscriptions/store/email/:storeEmail', getStoreSubscription);

router.post('/subscriptions/store/email/:storeEmail', createSubscription);

/* Pay store subscription (only contact the bank (the subscription is ativated when its paid))*/
router.post('/subscriptions/pay-subscription/store/email/:storeEmail', paySubscription);

module.exports = router;
