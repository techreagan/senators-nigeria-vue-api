const db = require('../config/db')

module.exports = class Senator {
	constructor(id, name, phoneNumber, email, state) {
		this.id = id
		this.name = name
		this.phoneNumber = phoneNumber
		this.email = email
		this.state = state
	}

	save() {
		if (this.id) {
			// console.log('helow')
			return db.execute(
				'UPDATE senators SET name = ?, phoneNumber = ?, email = ?, state = ? WHERE id = ?',
				[this.name, this.phoneNumber, this.email, this.state, this.id]
			)
		} else {
			// console.log(this)
			return db.execute(
				'INSERT INTO senators(name, phoneNumber, email, state) VALUES(?, ?, ?, ?)',
				[this.name, this.phoneNumber, this.email, this.state]
			)
		}
	}

	static fetchAll(query) {
		// console.log(query)
		const searchQuery =
			query.name || query.state
				? `WHERE senators.name LIKE '%${query.name}%' OR states.state LIKE '%${query.state}%'`
				: ''

		return db.execute(
			`SELECT senators.id, senators.name, senators.email, senators.phoneNumber, states.state FROM senators INNER JOIN states ON senators.state = states.id ${searchQuery} ORDER BY states.id ASC LIMIT ${query.page}, ${query.limit}`
		)
	}

	static counts() {
		return db.execute('SELECT COUNT(*) AS total FROM senators')
	}

	static findById(id) {
		return db.execute('SELECT * FROM senators WHERE id = ?', [id])
	}

	static findByEmail(email) {
		return db.execute('SELECT email FROM senators WHERE email = ?', [email])
	}

	static findByPhoneNumber(phoneNumber) {
		return db.execute(
			'SELECT phoneNumber FROM senators WHERE phoneNumber = ?',
			[phoneNumber]
		)
	}

	static deleteById(id) {
		return db.execute('DELETE FROM senators WHERE id = ? LIMIT 1', [id])
	}
}
