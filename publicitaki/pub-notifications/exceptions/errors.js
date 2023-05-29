class NoSuchEntryError extends Error {
  constructor(message) {
    super(message);
  }
}

class CreateCustomerError extends Error {
  constructor(message) {
    super(message);
  }
}

class InvalidDateError extends Error {
  constructor(message) {
    super(message);
  }
}

class InvalidOrEmptyFieldsError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = {
  NoSuchEntryError,
  CreateCustomerError,
  InvalidDateError,
  InvalidOrEmptyFieldsError,
}