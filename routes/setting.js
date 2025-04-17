const express = require('express');
const router = express.Router();
const {getSettingsPage, updateProfile, checkAuthenticated } = require('../app/config/auth')

router.get('/settings', checkAuthenticated,getSettingsPage);
router.post('/settings', checkAuthenticated, updateProfile);

module.exports = router;
