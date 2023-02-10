const db = require('../util/database');

module.exports = class Donation {
    constructor(id, blood_type, donor_id) {
        this.id = id;
        this.blood_type = blood_type;
        this.donor_id = donor_id;
    }

    save() {
        return db.execute(
            'INSERT INTO donations (blood_type, donor_id) VALUES (?, ?)', [this.blood_type, this.donor_id]
        );
    }

    fetchAll() {
        return db.execute(
            'SELECT * FROM donations', []
        );
    }

}