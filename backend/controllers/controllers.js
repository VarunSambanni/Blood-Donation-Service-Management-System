const jwt = require('jsonwebtoken');

const Organisation = require('../models/organisations');
const Donor = require('../models/donors');

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
                expiresIn: 3600
            });

            return res.json({ success: true, msg: "Succesfully logged In", token: token, email: email });
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
    const token = jwt.sign({}, JWT_SECRET_ORGANISATION, {
        expiresIn: 3600
    });

    return res.json({ success: true, msg: "Succesfully logged In", token: token, email: email });
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
                expiresIn: 3600
            });

            return res.json({ success: true, msg: "Succesfully logged In", token: token, email: email });
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
                    console.log("Error signing up ", err)
                    return res.json({ success: false, msg: "Signup Unsuccessful" })
                })
        })
}