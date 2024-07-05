const express = require('express');
const refereeController = require('../controllers/referee.controller');

const router = express.Router();

router.post('/', refereeController.verifyReferralCode);

module.exports.RefereeRouter = router;