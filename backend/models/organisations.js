const db = require('../util/database');

module.exports = class Organisation {
    constructor(id, email, password, name, size) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.size = size;
    }

    save() {
        return db.execute(
            'INSERT INTO organisations(email, password, name, size) VALUES (?, ?, ?, ?)', [this.email, this.password, this.name, this.size]
        );
    }

    static findByEmailOrName(email, name) {
        return db.execute('SELECT * FROM organisations WHERE email = ? OR name = ?', [email, name]);
    }

    static findByEmailAndPassword(email, password) {
        return db.execute('SELECT * FROM organisations WHERE email = ? AND password = ?', [email, password]);
    }
}