const express = require('express');
const ReferrerController = require('../controllers/referrer.controller');


const router = express.Router();

router.post('/', ReferrerController.createReferrer);
router.get('/:id', ReferrerController.getReferrer);
router.get('/email/:email', ReferrerController.getReferrerByEmail);

module.exports.ReferrerRouter = router;