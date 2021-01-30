const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Senator = require('../models/Senator')
const { senatorValidation } = require('../utils/validations')
// const sendEmail = require('../utils/sendEmail')
const postmark = require('postmark')
const client = new postmark.ServerClient('a25eb8b2-e370-4b61-8138-da4581ec16d5')

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getSenators = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults)
})

// @desc    Get single senator
// @route   GET /api/v1/senators/:id
// @access  Public
exports.getSenator = asyncHandler(async (req, res, next) => {
	const [senator] = await Senator.findById(req.params.id)

	if (!senator.length)
		return next(
			new ErrorResponse(`No senator with that id of ${req.params.id}`)
		)

	res.status(200).json({ success: true, data: senator })
})

// @desc    Get senators count
// @route   GET /api/v1/senators/count
// @access  Public
exports.getSenatorsCount = asyncHandler(async (req, res, next) => {
	const [[total]] = await Senator.counts()

	res.status(200).json({ success: true, data: total.total })
})

// @desc    Create senator
// @route   POST /api/v1/senators
// @access  Public
exports.createSenator = asyncHandler(async (req, res, next) => {
	const { name, phoneNumber, email, state } = req.body

	const { error } = senatorValidation(req.body)

	if (error) {
		const errors = error.details.map((err) => {
			return {
				path: err.path[0],
				message: err.message,
			}
		})
		return next(new ErrorResponse(null, 400, errors))
	}

	let [findEmail] = await Senator.findByEmail(email)

	if (findEmail.length) {
		return next(new ErrorResponse(null, 400, { Email: 'Email already taken' }))
	}

	let [findPhoneNumber] = await Senator.findByPhoneNumber(phoneNumber)

	if (findPhoneNumber.length)
		return next(
			new ErrorResponse(null, 400, {
				'Phone Number': 'Phone numer already taken',
			})
		)

	let senator = new Senator(null, name, phoneNumber, email, state)
	senator.save()

	delete senator.id
	res.status(201).json({ success: true, data: senator })
})

// @desc    Update senator
// @route   PUT /api/v1/senators/:id
// @access  Senators
exports.updateSenator = asyncHandler(async (req, res, next) => {
	const { name, phoneNumber, email, state } = req.body

	let [senator] = await Senator.findById(req.params.id)

	if (!senator.length)
		return next(
			new ErrorResponse(`No senator with that id of ${req.params.id}`)
		)

	const { error } = senatorValidation(req.body)

	if (error) {
		const errors = error.details.map((err) => {
			return {
				path: err.path[0],
				message: err.message,
			}
		})
		return next(new ErrorResponse(null, 400, errors))
	}

	let [findEmail] = await Senator.findByEmail(email)

	if (findEmail.length && email !== senator[0].email) {
		return next(new ErrorResponse(null, 400, { Email: 'Email already taken' }))
	}

	let [findPhoneNumber] = await Senator.findByPhoneNumber(phoneNumber)

	if (findPhoneNumber.length && phoneNumber !== senator[0].phoneNumber) {
		return next(
			new ErrorResponse(null, 400, {
				'Phone Number': 'Phone numer already taken',
			})
		)
	}

	senator = new Senator(req.params.id, name, phoneNumber, email, state)
	const reagan = await senator.save()
	console.log(reagan)
	res.status(200).json({ success: true, data: senator })
})

// @desc    Send email to senator
// @route   POST /api/v1/senators/:id/send-email
// @access  Public
exports.sendSenatorEmail = asyncHandler(async (req, res, next) => {
	const [senator] = await Senator.findById(req.params.id)

	if (!senator.length)
		return next(
			new ErrorResponse(`No senator with that id of ${req.params.id}`)
		)

	try {
		// client.sendEmail({
		// 	From: 'techreagan@egbape.com',
		// 	To: senator[0].email,
		// 	Subject: req.body.subject,
		// 	TextBody: req.body.message,
		// 	MessageStream: 'outbound',
		// })
		res.status(200).json({ success: true, data: 'Email sent' })
	} catch (err) {
		return next(new ErrorResponse('Email could not be sent', 500))
	}
	// try {
	// 	await sendEmail({
	// 		email: senator[0].email,
	// 		subject: req.body.subject,
	// 		message: req.body.message,
	// 	})
	// 	res.status(200).json({ success: true, data: 'Email sent' })
	// } catch (err) {
	// 	return next(new ErrorResponse('Email could not be sent', 500))
	// }
})
// @desc    Delete senator
// @route   DELETE /api/v1/senators/:id
// @access  Public
exports.deleteSenator = asyncHandler(async (req, res, next) => {
	const [senator] = await Senator.findById(req.params.id)

	if (!senator.length)
		return next(
			new ErrorResponse(`No senator with that id of ${req.params.id}`)
		)

	await Senator.deleteById(req.params.id)

	res.status(200).json({ success: true, data: {} })
})
