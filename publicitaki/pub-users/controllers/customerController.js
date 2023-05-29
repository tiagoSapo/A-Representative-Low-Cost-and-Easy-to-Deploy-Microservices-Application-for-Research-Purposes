const customerService = require('../services/customerService');
const { SequelizeValidationError } = require('sequelize');
const { NoSuchEntryError } = require('../exceptions/errors')


async function getAllCustomers(req, res) {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function updateCustomerByEmail(req, res) {
  try {

    // Call service to update 
    const customer = await customerService.updateCustomerByEmail(req.params.email, req.body);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found or invalid JSON' });
    }

    // return updated in json format
    res.status(200).json(customer);

  } catch (err) {

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: 'Error: Please provide a valid Customer ID.' });
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


async function getCustomerById(req, res) {
  try {
    // Call service to get customer by id
    const customer = await customerService.getCustomerById(req.params.id);

    // Return customer with that id
    res.status(200).json(customer);

  } catch (err) {

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: `Error: There is no customer with ID = ${req.params.id}` });
      return;
    }

    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function doesCustomerExists(req, res) {
  try {
    const exists = await customerService.doesCustomerExist(req.body.email, req.body.password);
    res.status(200).json(exists);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid parameters' });
  }
}

async function getCustomerByEmail(req, res) {
  try {
    const exists = await customerService.getCustomerByEmail(req.params.email);
    res.status(200).json(exists);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid parameters' });
  }
}


async function getCustomerIdByEmail(req, res) {
  try {
    const exists = await customerService.getCustomerIdByEmail(req.params.email);
    res.status(200).json(exists);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid parameters' });
  }
}

async function createCustomer(req, res) {
  try {

    // Use service to create a new customer
    const customer = await customerService.createCustomer(req.body);

    // return ok status
    res.status(201).json(customer);

  } catch (err) {

    if (typeof err === 'object') {
      if (err.name === 'SequelizeValidationError') {
        res.status(400).json({ error: 'Error: invalid Customer, please check JSON parameters' });
        return;
      }
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: `Error: invalid Customer - email "${req.body.email}" must be unique` });
        return;
      }
    }

    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateCustomer(req, res) {
  try {

    // Call service to update customer
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found or invalid JSON' });
    }

    // return updated customer in json format
    res.status(200).json(customer);

  } catch (err) {

    if (err instanceof NoSuchEntryError) {
      res.status(400).json({ error: 'Error: Please provide a valid customer ID.' });
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


async function deleteCustomer(req, res) {
  try {
    const rowsDeleted = await customerService.deleteCustomer(req.params.id);
    if (rowsDeleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  doesCustomerExists,
  getCustomerIdByEmail,
  getCustomerByEmail,
  updateCustomerByEmail
};
