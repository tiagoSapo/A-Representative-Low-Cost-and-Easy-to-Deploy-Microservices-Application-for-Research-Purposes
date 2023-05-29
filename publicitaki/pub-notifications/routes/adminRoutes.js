const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController')



router.get('/notifications-admin/', adminController.getAll);
router.get('/notifications-admin/:id', adminController.getById);
router.post('/notifications-admin/', adminController.createAdminNotification);
router.delete('/notifications-admin/:id', adminController.deleteAdminNotification);


module.exports = router;

