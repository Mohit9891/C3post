const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js');
const isAdmin = require('../middlewares/isAdmin.js');
// const { getPendingUsers, updateUserStatus } = require('../controllers/adminController');

const { getAllUsers, updateUserStatus } = require('../controllers/adminController');
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.patch('/users/:id/status', verifyToken, isAdmin, updateUserStatus);

module.exports = router;