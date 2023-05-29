const express = require('express');
const router = express.Router();
const normalController = require('../controllers/normalController')

router.get('/notifications/', normalController.getAll);
router.get('/notifications/:id', normalController.getById);
router.post('/notifications/', normalController.createNormalNotification);
router.delete('/notifications/:id', normalController.deleteNormalNotification);

module.exports = router;
