const express = require('express')
const {
	getSenators,
	getSenator,
	getSenatorsCount,
	createSenator,
	sendSenatorEmail,
	updateSenator,
	deleteSenator,
} = require('../controllers/senators')

const advancedResults = require('../middleware/advancedResults')
const Senator = require('../models/Senator')

const router = express.Router()

router.route('/').get(advancedResults(Senator), getSenators).post(createSenator)

router.route('/count').get(getSenatorsCount)

router.route('/:id').get(getSenator).put(updateSenator).delete(deleteSenator)

router.route('/:id/send-email').post(sendSenatorEmail)

module.exports = router
