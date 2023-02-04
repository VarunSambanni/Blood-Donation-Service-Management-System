
const jwt = require('jsonwebtoken');

JWT_SECRET_DONOR = 'secret-1';
JWT_SECRET_ORGANISATION = 'secret-2';

exports.getHome = (req, res, next) => {
    return res.json({ success: true, msg: "Hello" });
}

exports.postLoginDonor = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Request for donor login : ", email);
    const token = jwt.sign({}, JWT_SECRET_DONOR, {
        expiresIn: 900
    });

    return res.json({ success: true, msg: "Succesfully logged In", token: token, email: email });
}

exports.postLoginOrganisation = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Request for organisation login : ", email);
    const token = jwt.sign({}, JWT_SECRET_ORGANISATION, {
        expiresIn: 900
    });

    return res.json({ success: true, msg: "Succesfully logged In", token: token, email: email });
}

exports.getCheckAuth = (req, res, next) => {
    console.log("Auth successful");
    return res.status(200).json({ success: true, msg: "Successfully Authenticated" });
}