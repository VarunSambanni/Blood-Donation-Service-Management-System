const db = require('../util/database');

module.exports = class Reception {
    constructor(id, name, email, phone_no, blood_type, unit_id) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone_no = phone_no;
        this.blood_type = blood_type;
        this.unit_id = unit_id;
    }

    save() {
        console.log("Query ", this.name, this.email, this.phone_no, this.blood_type, this.unit_id);
        return db.execute(
            'INSERT INTO receptions (name, email, phone_no, blood_type, unit_id) VALUES (?, ?, ?, ?, ?)', [this.name, this.email, this.phone_no, this.blood_type, this.unit_id]
        );
    }

}