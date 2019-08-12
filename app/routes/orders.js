const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const order = require('../controllers/order');

router.get('/', order.getAll);

router.post('/', checkAuth, order.create);

router.get('/:orderId', order.getById);

router.patch('/:orderId', checkAuth, order.update);

router.delete('/:orderId', checkAuth, order.destroy);

module.exports = router;