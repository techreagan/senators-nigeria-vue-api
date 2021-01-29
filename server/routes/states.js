const express = require('express')
const { getStates, getStateCounts } = require('../controllers/states')

const router = express.Router()

router.route('/').get(getStates)

router.route('/count').get(getStateCounts)

module.exports = router
