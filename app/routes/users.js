const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const checkAuth = require('../middlewares/checkAuth');

router.post('/signup', user.signup);

router.post('/login', user.login);

router.delete('/:userId', checkAuth, user.destroy);

module.exports = router;