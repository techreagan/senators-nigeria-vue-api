const db = require('../config/db')

module.exports = class Senator {
	static fetchAll() {
		return db.execute(`SELECT * FROM states `)
	}

	static counts() {
		return db.execute('SELECT COUNT(*) AS total FROM states')
	}
}
