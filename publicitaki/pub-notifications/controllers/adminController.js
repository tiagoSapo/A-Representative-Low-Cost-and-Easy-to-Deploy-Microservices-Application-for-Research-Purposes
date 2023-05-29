
const AdminNotification = require('../models/adminNotification');


async function getAll(req, res) {
  try {
    const notifications = await AdminNotification.findAll();
    return res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function createAdminNotification(req, res) {
  try {
    const { title, description, operation_type } = req.body;
    const notification = await AdminNotification.create({ title, description, operation_type });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating admin notification:', error.message);
    res.status(400).json({ error: 'Error creating admin notification: Please check your JSON format' });
  }
}

async function getById(req, res) {
  const id = req.params.id;

  if (id == null) {
    return res.status(400).json({ error: "No id provided" });
  }

  try {
    const notification = await AdminNotification.findByPk(id);
    if (notification == null) {
      return res.status(400).json(`Notification ${id} not found`);
    }

    res.json(notification);

  } catch (err) {
    console.log("Internal server error: " + err.message);
    res.status(500).json("Internal server error");
  }
}

async function deleteAdminNotification(req, res) {
  const id = req.params.id;

  if (id == null) {
    return res.status(400).json({ error: "No id provided" });
  }

  try {
    const notification = await AdminNotification.findByPk(id);
    if (notification == null) {
      return res.status(400).json(`Notification ${id} not found`);
    }

    await AdminNotification.destroy({ where: { id } });
    return res.status(204).json(`Notification ${id} successfully deleted`);

  } catch (err) {
    console.log("Internal server error: " + err.message);
    res.status(500).json("Internal server error");
  }
}

module.exports = { createAdminNotification, getAll, getById, deleteAdminNotification };

