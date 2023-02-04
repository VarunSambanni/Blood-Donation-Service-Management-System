const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const controllers = require('../controllers/controllers');

JWT_SECRET_DONOR = 'secret-1';
JWT_SECRET_ORGANISATION = 'secret-2';

const verifyJWTDonor = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ success: false, msg: "Token needed" });
    }
    else {
        jwt.verify(token, JWT_SECRET_DONOR, (err, decoded) => {
            if (err) {
                return res.json({ success: false, msg: "Failed to Authenticate" });
            }
            req.userId = decoded.id;
            next();
        })
    }
}

const verifyJWTOrganisation = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ success: false, msg: "Token needed" });
    }
    else {
        jwt.verify(token, JWT_SECRET_ORGANISATION, (err, decoded) => {
            if (err) {
                return res.json({ success: false, msg: "Failed to Authenticate" });
            }
            req.userId = decoded.id;
            next();
        })
    }
}

router.get('/', controllers.getHome);

router.post('/loginDonor', controllers.postLoginDonor);

router.post('/loginOrganisation', controllers.postLoginOrganisation);

router.get('/checkAuthDonor', verifyJWTDonor, controllers.getCheckAuth); // Just to check if user is auth 

router.get('/checkAuthOrganisation', verifyJWTOrganisation, controllers.getCheckAuth);
module.exports = router; 