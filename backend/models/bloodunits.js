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

    static fetchAll() {
        return db.execute(
            'SELECT * FROM bloodunits ', []
        )
    }

}