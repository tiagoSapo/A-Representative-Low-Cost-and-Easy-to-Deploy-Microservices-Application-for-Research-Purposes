const { client, TOPIC_READ, TOPIC_WRITE } = require('../mqtt');
const subscriptionService = require('../services/subscriptionService');
const { SequelizeValidationError } = require('sequelize');
const { NoSuchEntryError, InvalidDateError, InvalidOrEmptyFieldsError } = require('../exceptions/errors');
const Store = require('../models/store');
const Subscription = require('../models/subscription');

async function getAllSubscriptions(req, res) {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function getStoreSubscription(req, res) {

  try {
    const subs = await subscriptionService.getStoreSubscription(req.params.storeEmail);
    res.json(subs);
  } catch (err) {

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: `Error: There is no store with ID = ${req.params.storeId}` });
      return;
    }

    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

}

async function createSubscription(req, res) {

  try {
    const subs = await subscriptionService.createOrUpdateSubscriptionForStore(req.body.expirationDate, req.body.active, req.params.storeEmail);
    res.json(subs);
  } catch (err) {

    if (err instanceof InvalidDateError || err instanceof InvalidOrEmptyFieldsError) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: `Error: There is no store with ID = ${req.params.storeId}` });
      return;
    }

    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

}

async function getSubscriptionById(req, res) {
  try {
    // Call service to get sub by id
    const sub = await subscriptionService.getSubscriptionById(req.params.id);

    // Return subscription with that id
    res.status(200).json(sub);

  } catch (err) {

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: `Error: There is no subscription with ID = ${req.params.id}` });
      return;
    }

    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function deleteSubscription(req, res) {
  try {
    const rowsDeleted = await subscriptionService.deleteSubscription(req.params.id);
    if (rowsDeleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Subscription not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


async function postSubscription(req, res) {
  try {
    return res.json(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function paySubscription(req, res) {

  try {

    const storeEmail = req.params.storeEmail;

    const store = await Store.findOne({
      where: { email: storeEmail },
      include: [{ model: Subscription }]
    });
    if (!store) {
      res.status(401).json({ error: `There is no store ${storeEmail}` });
      return;
    }

    /* Assuming the subscription cost is always = 10€ */
    const payload = {
      ibanSender: store.bankAccount,
      ibanReceiver: -1,
      amount: 10,
      date: Date.now(),
      orderId: store.id, /* 'Order id' is the store's id */
      confirmationTopic: TOPIC_READ,
    };

    // convert the payload to a JSON string
    const payloadString = JSON.stringify(payload);
    client.publish(TOPIC_WRITE, payloadString);

    console.log("Transaction details: " + payloadString);
    console.log("Subscription will activate after the payment is confirmed.");

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

}

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  deleteSubscription,
  postSubscription,
  getStoreSubscription,
  createSubscription,
  paySubscription
}