const Subscription = require('../models/subscription');
const Store = require('../models/store');
const { NoSuchEntryError, InvalidDateError, InvalidOrEmptyFieldsError } = require("../exceptions/errors");

async function getSubscriptionById(subscriptionId) {

    const sub = await Subscription.findByPk(subscriptionId);
    if (sub == null) {
        throw new NoSuchEntryError(`Subscription with ID ${subscriptionId} not found`);
    }
    return sub;
}

async function getStoreSubscription(storeEmail) {

    if (!storeEmail) {
        throw new InvalidOrEmptyFieldsError('No store email provided. Check your URI');
    }

    const store = await Store.findOne({
        where: { email: storeEmail },
        include: [{ model: Subscription }]
    });

    if (!store) {
        throw new NoSuchEntryError('Store not found');
    }

    return store.Subscription;
}

async function createOrUpdateSubscriptionForStore(expirationDate, active, storeEmail) {
    if (!(active === 'true' || active === 'false')) {
        throw new InvalidOrEmptyFieldsError('The "active" field must be a boolean. Check your json');
    }

    if (isNaN(Date.parse(expirationDate))) {
        throw new InvalidOrEmptyFieldsError('The "expirationDate" field must be a valid date. Check your json');
    }

    const currentTime = new Date();
    if (Date.parse(expirationDate) <= currentTime) {
        throw new InvalidDateError('Expiration date must be after the current time');
    }

    if (!storeEmail) {
        throw new InvalidOrEmptyFieldsError('No store email provided. Check your URI');
    }

    const store = await Store.findOne({ where: { email: storeEmail } });
    if (!store) {
        throw new NoSuchEntryError('Store not found');
    }

    let subscription = await Subscription.findOne({ where: { StoreId: store.id } });
    if (subscription) {
        subscription.expirationDate = expirationDate;
        subscription.active = active;
        await subscription.save();
    } else {
        subscription = await Subscription.create({
            expirationDate,
            active,
            StoreId: store.id
        });
    }

    return subscription;
}

async function createOrUpdateSubscriptionForStoreById(expirationDate, active, storeId) {
    if (!(active === 'true' || active === 'false')) {
        throw new InvalidOrEmptyFieldsError('The "active" field must be a boolean. Check your json');
    }

    if (isNaN(Date.parse(expirationDate))) {
        throw new InvalidOrEmptyFieldsError('The "expirationDate" field must be a valid date. Check your json');
    }

    const currentTime = new Date();
    if (Date.parse(expirationDate) <= currentTime) {
        throw new InvalidDateError('Expiration date must be after the current time');
    }

    if (!storeId) {
        throw new InvalidOrEmptyFieldsError('No store id provided. Check your URI');
    }

    const store = await Store.findOne({ where: { id: storeId } });
    if (!store) {
        throw new NoSuchEntryError('Store not found');
    }

    let subscription = await Subscription.findOne({ where: { StoreId: store.id } });
    if (subscription) {
        subscription.expirationDate = expirationDate;
        subscription.active = active;
        await subscription.save();
    } else {
        subscription = await Subscription.create({
            expirationDate,
            active,
            StoreId: store.id
        });
    }

    return subscription;
}


async function getAllSubscriptions() {

    try {
        const subscriptions = await Subscription.findAll();
        return subscriptions;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function deleteSubscription(subId) {
    try {
        const deletedSub = await Subscription.destroy({
            where: {
                id: subId
            }
        });
        return deletedSub;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    getSubscriptionById,
    getAllSubscriptions,
    deleteSubscription,
    getStoreSubscription,
    createOrUpdateSubscriptionForStore,
    createOrUpdateSubscriptionForStoreById
};