const db = require('../util/database');

module.exports = class Organisation {
    constructor(id, name, size) {
        this.id = id;
        this.name = name;
        this.size = size;
    }

    save() {
        return db.execute(
            'INSERT INTO organisations VALUES (?, ?)', [this.name, this.size]
        );
    }
}