const asyncHandler = require('../middleware/async')
const State = require('../models/State')

// @desc    Get all state
// @route   GET /api/v1/states
// @access  Public
exports.getStates = asyncHandler(async (req, res, next) => {
	const [states] = await State.fetchAll()
	res.status(200).json({ success: true, data: states })
})

// @desc    Get states count
// @route   GET /api/v1/states/count
// @access  Public
exports.getStateCounts = asyncHandler(async (req, res, next) => {
	const [[total]] = await State.counts()

	res.status(200).json({ success: true, data: total.total })
})
