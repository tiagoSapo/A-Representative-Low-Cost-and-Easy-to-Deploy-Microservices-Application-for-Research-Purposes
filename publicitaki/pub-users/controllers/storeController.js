
const storeService = require('../services/storeService');
const { SequelizeValidationError } = require('sequelize');
const { NoSuchEntryError } = require('../exceptions/errors')

async function getAllStores(req, res) {
  try {
    const stores = await storeService.getAllStores();
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' + err });
  }
}

async function getStoreById(req, res) {
  try {
    // Call service to get store by id
    const store = await storeService.getStoreById(req.params.id);

    // Return store with that id
    res.status(200).json(store);

  } catch (err) {

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: `Error: There is no store with ID = ${req.params.id}` });
      return;
    }

    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function doesStoreExists(req, res) {
  try {
    const exists = await storeService.doesStoreExists(req.body.email, req.body.password);
    res.status(200).json(exists);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid parameters' });
  }
}

async function getStoreByEmail(req, res) {
  try {
    const exists = await storeService.getStoreByEmail(req.params.email);
    res.status(200).json(exists);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid parameters or store doesnt exist' });
  }
}

async function getStoreIdByEmail(req, res) {
  try {
    const exists = await storeService.getIdByEmail(req.params.email);
    res.status(200).json(exists);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid parameters' });
  }
}

async function createStore(req, res) {
  try {

    // Use service to create a new store
    const store = await storeService.createStore(req.body);

    // return ok status
    res.status(201).json(store);

  } catch (err) {

    if (typeof err === 'object') {
      if (err.name === 'SequelizeValidationError') {
        res.status(400).json({ error: 'Error: invalid Store, please check JSON parameter "websiteURL" ' });
        return;
      }
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: `Error: invalid Store. These parameters: 'name', 'websiteUrl' and 'email' must be unique` });
        return;
      }
    }

    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateStore(req, res) {
  try {

    // Call service to update store
    const store = await storeService.updateStore(req.params.id, req.body);
    if (!store) {
      res.status(404).json({ error: 'Store not found or invalid JSON' });
    }

    // return updated store in json format
    res.status(200).json(store);

  } catch (err) {

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: 'Error: Please provide a valid store ID.' });
      return;
    }
    if (err instanceof Object && err.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Error: Invalid email or password(min=4, max=20)' });
      return;
    }

    const errorMsg = `Server error: ${err.message}`;
    console.error(errorMsg);
    res.status(500).json({ error: errorMsg });
  }
}

async function updateStoreByEmail(req, res) {
  try {

    // Call service to update store
    const store = await storeService.updateStoreByEmail(req.params.email, req.body);
    if (!store) {
      res.status(404).json({ error: 'Store not found or invalid JSON' });
    }

    // return updated store in json format
    res.status(200).json(store);

  } catch (err) {

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: 'Error: Please provide a valid store ID.' });
      return;
    }
    if (err instanceof Object && err.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Error: Invalid email or password(min=4, max=20)' });
      return;
    }

    const errorMsg = `Server error: ${err.message}`;
    console.error(errorMsg);
    res.status(500).json({ error: errorMsg });
  }
}






async function deleteStore(req, res) {
  try {
    const rowsDeleted = await storeService.deleteStore(req.params.id);
    if (rowsDeleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


/**
 * Gets all store's subscriptions
 */
async function createStoreSubscription(req, res) {
  return await storeService.createSubscription(req, res);
}

async function getStoreSubscriptions(req, res) {
  return await storeService.getStoreSubscriptions(req, res);
}


module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,

  createStoreSubscription,
  getStoreSubscriptions,
  doesStoreExists,

  getStoreByEmail,
  getStoreIdByEmail,
  updateStoreByEmail,
};
