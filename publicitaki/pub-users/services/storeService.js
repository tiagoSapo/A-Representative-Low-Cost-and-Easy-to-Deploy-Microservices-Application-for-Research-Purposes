
const Store = require('../models/store');
const Subscription = require('../models/subscription');
const { NoSuchEntryError } = require("../exceptions/errors");

const { createOrUpdateSubscriptionForStoreById } = require("./subscriptionService");

async function createStore(storeData) {
    // Remove the `id` field if it exists
    if (storeData.id) {
        delete storeData.id;
    }

    const store = await Store.create(storeData);

    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 5);

    const result = createOrUpdateSubscriptionForStoreById(currentDate, "false", store.id);
    console.log(result);
    console.log(store);

    return store;
}

async function getStoreById(storeId) {

    const store = await Store.findByPk(storeId);
    if (store == null) {
        throw new NoSuchEntryError(`Store with ID ${storeId} not found`);
    }
    return store;

}

async function getStoreByEmail(email) {

    const store = await Store.findOne({
        where: {
            email: email,
        }
    });

    if (store == null) {
        throw new NoSuchEntryError(`Store with email ${email} not found`);
    }

    return store;
}

async function doesStoreExists(email, password) {
    const store = await Store.findOne({
        where: {
            email: email,
            password: password
        }
    });

    return !!store; // convert customer object to boolean
}

async function getIdByEmail(email) {
    const store = await Store.findOne({
        where: {
            email: email,
        }
    });

    return store.id;
}

async function getAllStores() {

    try {
        const stores = await Store.findAll();
        return stores;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function updateStore(storeId, updates) {
    // Get existing store with id = 'storeId'
    const store = await Store.findByPk(storeId);
    if (!store) {
        throw new NoSuchEntryError(`Store with ID ${storeId} not found`);
    }

    // Remove id from JSON (if it's provided)
    updates.id = storeId;

    // Update store
    const updatedStore = await store.update(updates);

    // Return updated store
    return updatedStore;
}

async function updateStoreByEmail(email, updates) {

    // Get existing store with email
    const updatedStore = Store.update(
        { name: updates.name, location: updates.location, websiteUrl: updates.websiteUrl, bankAccount: updates.bankAccount },
        { where: { email: email } }
    )
        .then(result =>
            () => { return result; }
        )
        .catch(err =>
            () => { throw Error(err); }
        );

    // Return updated store
    return updatedStore;
}

async function deleteStore(storeId) {
    try {
        const deletedStore = await Store.destroy({
            where: {
                id: storeId
            }
        });
        return deletedStore;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function createSubscription(req, res) {
    const storeId = req.params.id;
    const { startDate, endDate } = req.body;

    // BY DEFAULT SUBSCRIPTIONS ARE 'FALSE'
    const active = false;

    // Check if dates are valid
    const ok = areDatesValid(startDate, endDate);
    if (!ok) {
        return res.status(404).json({ error: `Invalid dates ${startDate} and ${endDate}` });
    }

    try {
        // Find the store with the given ID
        const store = await Store.findByPk(storeId);
        if (!store) {
            return res.status(404).json({ error: `Store with ID ${storeId} not found` });
        }

        // Create a new subscription with the given start and end dates
        const subscription = await Subscription.create({
            startDate,
            endDate,
            active
        });

        // Add the subscription to the store's subscriptions
        await store.addSubscription(subscription);

        // Return the updated store object with the new subscription
        const updatedStore = await Store.findByPk(storeId, {
            include: { model: Subscription },
        });
        return res.json(updatedStore);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create store subscription' });
    }
}

async function getStoreSubscriptions(req, res) {

    try {
        // get the store's id
        const storeId = req.params.id;

        // get store by id
        const store = await Store.findByPk(storeId, { include: Subscription });
        if (!store) {
            return res.status(400).json({ error: `Store with ID ${storeId} not found` });
        }

        return res.json(store);

    } catch (err) {
        return res.status(500).json({ error: ('Internal server error: ' + err) });
    }
}

function areDatesValid(startDate, endDate) {
    function isValidDate(dateString) {
        return !isNaN(new Date(dateString).getTime());
    }

    if (!startDate || !endDate) {
        return false;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return false;
    }
    return new Date(startDate) < new Date(endDate);
}



module.exports = {
    createStore,
    getStoreById,
    getAllStores,
    updateStore,
    deleteStore,

    createSubscription,
    getStoreSubscriptions,
    doesStoreExists,

    getStoreByEmail,
    getIdByEmail,
    updateStoreByEmail,

};