const db = require('../util/database');

module.exports = class Donor {
    constructor(id, email, password, phone_no, blood_type) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.phone_no = phone_no;
        this.blood_type = blood_type;
    }

    static fetchAll() {
        return db.execute('SELECT donor_id, email, phone_no, blood_type from donors');
    }

    static findById(id) {
        return db.execute('SELECT * FROM donors WHERE donor_id = ?', [id]);
    }

    static findByEmailAndPassword(email, password) {
        return db.execute('SELECT * FROM donors WHERE email = ? AND password = ? ', [email, password]);
    }

    static findByEmail(email) {
        return db.execute('SELECT * FROM donors WHERE email = ?', [email]);
    }

    save() {
        console.log("Inserting ", this.email, this.password, this.phone_no, this.blood_type);
        return db.execute(
            'INSERT INTO donors (email, password, phone_no, blood_type) VALUES (?, ?, ?, ?)', [this.email, this.password, this.phone_no, this.blood_type]
        );
    }
}