const jwt = require('jsonwebtoken');

const Organisation = require('../models/organisations');
const Donor = require('../models/donors');
const Event = require('../models/events');

JWT_SECRET_DONOR = 'secret-1';
JWT_SECRET_ORGANISATION = 'secret-2';
JWT_SECRET_ADMIN = 'secret-3';

exports.getHome = (req, res, next) => {
    return res.json({ success: true, msg: "Hello" });
}

exports.postLoginDonor = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Request for donor login : ", email);

    Donor.findByEmailAndPassword(email, password)
        .then(data => {
            if (data[0].length === 0) {
                return res.json({ success: false, msg: "Invalid credentials" });
            }
            const token = jwt.sign({}, JWT_SECRET_DONOR, {
                expiresIn: '1h'
            });

            return res.json({ success: true, msg: "Succesfully logged In", token: token, email: email, id: data[0][0].donor_id });
        })
        .catch(err => {
            console.log("Error logging in donor ", err);
            return res.json({ success: false, msg: "Login Unsuccessful" });
        })
}

exports.postLoginOrganisation = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Request for organisation login : ", email);

    Organisation.findByEmailAndPassword(email, password)
        .then(data => {
            if (data[0].length === 0) {
                return res.json({ success: false, msg: "Invalid credentials" });
            }
            const name = data[0][0].name;
            const token = jwt.sign({}, JWT_SECRET_ORGANISATION, {
                expiresIn: '1h'
            });
            return res.json({ success: true, msg: "Succesfully logged In", token: token, email: email, name: name, id: data[0][0].org_id });
        })
        .catch(err => {
            console.log("Error logging in organisation ", err);
            return res.json({ success: false, msg: "Login Unsuccessful" });
        })
}

exports.postLoginAdmin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Request for Admin login : ", email);
    if (email !== 'admin@admin.com') {
        return res.json({ success: false, msg: "Invalid credentials" });
    }
    Donor.findByEmailAndPassword(email, password)
        .then(data => {
            console.log(data);
            if (data[0].length === 0) {
                return res.json({ success: false, msg: "Invalid credentials" });
            }
            const token = jwt.sign({}, JWT_SECRET_ADMIN, {
                expiresIn: '1h'
            });

            return res.json({ success: true, msg: "Succesfully logged In", token: token, email: email, id: data[0][0].donor_id });
        })
        .catch(err => {
            console.log("Error logging in admin ", err);
            return res.json({ success: false, msg: "Login Unsuccessful" });
        })
}


exports.getCheckAuth = (req, res, next) => {
    console.log("Auth successful");
    return res.status(200).json({ success: true, msg: "Successfully Authenticated" });
}

exports.postSignupDonor = (req, res, next) => {
    console.log("Signing up donor : ", req.body.email);
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const phone_no = req.body.phone_no;
    const blood_type = req.body.blood_type;
    const donor = new Donor(null, email, password, phone_no, blood_type);

    if (password !== confirmPassword) {
        return res.json({ success: false, msg: "Passwords don't match" });
    }

    Donor.findByEmail(email)
        .then(data => {
            if (data[0].length !== 0) {
                return res.json({ success: false, msg: "Donor already exists" });
            }
            donor.save()
                .then(() => {
                    return res.json({ success: true, msg: "Signed Up Successfully" });
                })
                .catch(err => {
                    console.log("Error signing up ", err)
                    return res.json({ success: false, msg: "Signup Unsuccessful" })
                })
        })
}

exports.postOrganisationSignup = (req, res, next) => {
    console.log("Signing up Organisation : ", req.body.email);
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const name = req.body.name;
    const size = req.body.size;
    const organisation = new Organisation(null, email, password, name, size);
    console.log("Here ", req.body)

    if (password !== confirmPassword) {
        return res.json({ success: false, msg: "Passwords don't match" });
    }

    Organisation.findByEmailOrName(email, name)
        .then(data => {
            if (data[0].length !== 0) {
                return res.json({ success: false, msg: "Organisation already exists" });
            }
            organisation.save()
                .then(() => {
                    return res.json({ success: true, msg: "Signed Up Successfully" });
                })
                .catch(err => {
                    console.log("Error signing up ", err);
                    return res.json({ success: false, msg: "Signup Unsuccessful" });
                })
        })
}

exports.postAddEvent = (req, res, next) => {
    const description = req.body.description;
    const time = req.body.time;
    const venue = req.body.venue;
    const org_id = req.body.org_id;

    const event = new Event(null, description, time, venue, org_id);

    event.save()
        .then(() => {
            return res.json({ success: true, msg: "Event Added Successfully" });
        })
        .catch(err => {
            console.log("Error Adding Event ", err);
            return res.json({ success: false, msg: "Event Could Not Be Added" });
        })
}

exports.getEventNamesByIds = (req, res, next) => {
    Event.getEventNamesByIds()
        .then(data => {
            let newData = {};
            for (let i = 0; i < data[0].length; i++) {
                newData[data[0][i].event_id] = data[0][i].name;
            }
            return res.json({ success: true, data: newData });
        })
        .catch(err => {
            console.log("Error getting event name ", err);
            return res.json({ success: true, msg: "Error Getting Event Name " });
        })
}

exports.getAllEvents = (req, res, next) => {
    Event.fetchAll()
        .then(data => {
            return res.json({ success: true, data: data[0] });
        })
        .catch(err => {
            console.log("Error fetching events ", err);
            return res.json({ success: false, msg: "Could Not Fetch Events" });
        })
}