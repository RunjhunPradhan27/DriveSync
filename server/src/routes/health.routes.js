const express = require('express');

const router = express.Router();

/**
 * @route   GET /
 * @desc    Basic liveness check for the API
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'DriveSync API is running smoothly'
  });
});

module.exports = router;
