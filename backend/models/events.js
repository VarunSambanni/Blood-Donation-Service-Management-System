const db = require('../util/database');

module.exports = class Event {
    constructor(id, description, time, venue, org_id) {
        this.id = id;
        this.description = description;
        this.time = time;
        this.venue = venue;
        this.org_id = org_id;
    }

    save() {
        return db.execute(
            'INSERT INTO events (description, time, venue, org_id) VALUES (?, ?, ?, ?)', [this.description, this.time, this.venue, this.org_id]
        );
    }

    static getEventNamesByIds() {
        return db.execute(
            'SELECT name, event_id FROM events E join organisations O ON E.org_id = O.org_id '
        );
    }

    static getEventsByOrgId(org_id) {
        return db.execute(
            'SELECT * from events WHERE org_id = ?', [org_id]
        );
    }

    static fetchAll() {
        return db.execute(
            'SELECT * FROM events'
        )
    }

}