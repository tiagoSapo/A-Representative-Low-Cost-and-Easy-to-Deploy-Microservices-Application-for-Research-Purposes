const Customer = require("../models/customer");
const { NoSuchEntryError } = require("../exceptions/errors");

async function createCustomer(customerData) {
  // Remove the `id` field if it exists
  if (customerData.id) {
    delete customerData.id;
  }

  const customer = await Customer.create(customerData);
  return customer;
}

async function updateCustomerByEmail(email, updates) {

  // Get existing store with email
  const updated = Customer.update(
    { name: updates.name, password: updates.password },
    { where: { email: email } }
  )
    .then(result =>
      () => { return result; }
    )
    .catch(err =>
      () => { throw Error(err); }
    );

  // Return updated store
  return updated;
}

async function getCustomerById(customerId) {
  const customer = await Customer.findByPk(customerId);
  if (customer == null) {
    throw new NoSuchEntryError(`Customer with ID ${customerId} not found`);
  }
  return customer;
}

async function getCustomerByEmail(email) {
  const customer = await Customer.findOne({ where: { email: email } });
  if (customer == null) {
    throw new NoSuchEntryError(`Customer with email ${email} not found`);
  }
  return customer;
}

async function doesCustomerExist(email, password) {
  const customer = await Customer.findOne({
    where: {
      email: email,
      password: password
    }
  });

  return !!customer; // convert customer object to boolean
}

async function getCustomerIdByEmail(email) {
  const customer = await Customer.findOne({
    where: {
      email: email,
    }
  });

  return customer.id;
}



async function getAllCustomers() {
  try {
    const customers = await Customer.findAll();
    return customers;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateCustomer(customerId, updates) {
  // Get existing customer with id = 'customerId'
  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    throw new NoSuchEntryError(`Customer with ID ${customerId} not found`);
  }

  // Remove id from JSON (if it's provided)
  updates.id = customerId;

  // Update customer
  const updatedCustomer = await customer.update(updates);

  // Return updated customer
  return updatedCustomer;
}

async function deleteCustomer(customerId) {
  try {
    const rowsDeleted = await Customer.destroy({
      where: { id: customerId },
    });
    return rowsDeleted;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  doesCustomerExist,
  getCustomerIdByEmail,
  getCustomerByEmail,
  updateCustomerByEmail
};
