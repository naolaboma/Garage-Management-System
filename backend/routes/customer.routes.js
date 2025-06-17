const express = require('express');
const customerController = require('../controllers/custumer.controller');
const authMiddleware = require('../middlewares/auth.midleware');

const router = express.Router();

// Search customers by keyword (first name, last name, email)
router.get(
  '/api/customer/search',
  [authMiddleware.verifToken, authMiddleware.isAdmin],
  customerController.searchCustomers
);

// Create new customer
router.post(
  '/api/customer',
  [authMiddleware.verifToken, authMiddleware.isAdmin],
  customerController.createCustomer
);

// Get single customer by id
router.get(
  '/api/customer/:id',
  [authMiddleware.verifToken, authMiddleware.isAdmin],
  customerController.getCustomer
);

// Get paginated list of customers
router.get(
  '/api/customer',
  [authMiddleware.verifToken, authMiddleware.isAdmin],
  customerController.getCustomers
);

// Update customer by id
router.put(
  '/api/customer/:id',
  [authMiddleware.verifToken, authMiddleware.isAdmin],
  customerController.updateCustomer
);

module.exports = router;
