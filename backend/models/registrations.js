const db = require('../util/database');

module.exports = class Registartion {
    constructor(donor_id, event_id) {
        this.donor_id = donor_id;
        this.event_id = event_id;
    }

    save() {
        console.log("INSERTING ", this.donor_id, this.event_id);
        return db.execute(
            'INSERT INTO registrations VALUES (?, ?)', [this.donor_id, this.event_id]
        );
    }

    static findRegistration(donor_id, event_id) {
        return db.execute('SELECT * FROM registrations WHERE donor_id = ? AND event_id = ?', [donor_id, event_id]);
    }

    static findRegistrationsByEventId(event_id) {
        return db.execute('SELECT * FROM registrations WHERE event_id = ?', [event_id]);
    }

    static getRegistrationsByIds() {
        return db.execute('SELECT D.donor_id, event_id, email, phone_no, blood_type FROM registrations R join donors D on R.donor_id = D.donor_id ')
    }
}