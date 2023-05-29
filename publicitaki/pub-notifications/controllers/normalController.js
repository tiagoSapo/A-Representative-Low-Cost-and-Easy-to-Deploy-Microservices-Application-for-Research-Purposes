
const NormalNotification = require('../models/normalNotification');


async function getAll(req, res) {
  try {
    const normalNotifications = await NormalNotification.findAll();
    return res.json(normalNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function createNormalNotification(req, res) {
  try {
    const { title, description, customer_id, store_id } = req.body;
    const notification = await NormalNotification.create({ title, description, customer_id, store_id });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating normal notification:', error.message);
    res.status(400).json({ error: 'Error creating normal notification: Please check your JSON format' });
  }
}

async function getById(req, res) {
  const id = req.params.id;

  if (id == null) {
    return res.status(400).json({ error: "No id provided" });
  }

  try {
    const notification = await NormalNotification.findByPk(id);
    if (notification == null) {
      return res.status(400).json(`Notification ${id} not found`);
    }

    res.json(notification);

  } catch (err) {
    console.log("Internal server error: " + err.message);
    res.status(500).json("Internal server error");
  }
}

async function deleteNormalNotification(req, res) {
  const id = req.params.id;

  if (id == null) {
    return res.status(400).json({ error: "No id provided" });
  }

  try {
    const notification = await NormalNotification.findByPk(id);
    if (notification == null) {
      return res.status(400).json(`Notification ${id} not found`);
    }

    await NormalNotification.destroy({ where: { id } });
    return res.status(204).json(`Notification ${id} successfully deleted`);

  } catch (err) {
    console.log("Internal server error: " + err.message);
    res.status(500).json("Internal server error");
  }
}


module.exports = { createNormalNotification, getAll, getById, deleteNormalNotification };
