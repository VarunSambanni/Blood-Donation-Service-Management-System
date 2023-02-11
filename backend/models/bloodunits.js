const db = require('../util/database');

module.exports = class bloodUnit {
    constructor(id, blood_type, don_id) {
        this.id = id;
        this.blood_type = blood_type;
        this.don_id = don_id;
    }

    save() {
        return db.execute(
            'INSERT INTO bloodunits (blood_type, don_id) VALUES (?, ?)', [this.blood_type, this.don_id]
        );
    }

    static findByBloodType(blood_type) {
        console.log("Query ", blood_type);
        return db.execute(
            'SELECT * FROM bloodunits WHERE blood_type = ?', [blood_type]
        );
    }

    static deleteById(unit_id) {
        return db.execute(
            'DELETE FROM bloodunits WHERE unit_id = ?', [unit_id]
        );
    }

    static fetchAll() {
        return db.execute(
            'SELECT * FROM bloodunits ', []
        )
    }

}