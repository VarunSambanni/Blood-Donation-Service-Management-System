const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const controllers = require('../controllers/controllers');

const verifyJWTDonor = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ success: false, msg: "Token needed" });
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET_DONOR, (err, decoded) => {
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
        jwt.verify(token, process.env.JWT_SECRET_ORGANISATION, (err, decoded) => {
            if (err) {
                return res.json({ success: false, msg: "Failed to Authenticate" });
            }
            req.userId = decoded.id;
            next();
        })
    }
}

const verifyJWTAdmin = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ success: false, msg: "Token needed" });
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, decoded) => {
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

router.post('/loginAdmin', controllers.postLoginAdmin);

router.get('/checkAuthDonor', verifyJWTDonor, controllers.getCheckAuth); // Just to check if user is auth 

router.get('/checkAuthOrganisation', verifyJWTOrganisation, controllers.getCheckAuth);

router.get('/checkAuthAdmin', verifyJWTAdmin, controllers.getCheckAuth);

router.post('/signupDonor', controllers.postSignupDonor);

router.post('/organisationSignup', verifyJWTAdmin, controllers.postOrganisationSignup);

router.post('/addEvent', verifyJWTOrganisation, controllers.postAddEvent);

router.get('/allEvents', verifyJWTDonor, controllers.getAllEvents);

router.get('/getEventNamesByIds', verifyJWTDonor, controllers.getEventNamesByIds);

router.get('/getEventNamesByIds-Admin', verifyJWTAdmin, controllers.getEventNamesByIds);

router.post('/registerEvent', verifyJWTDonor, controllers.postRegisterEvent);

router.post('/getAllEventsByOrganisation', verifyJWTOrganisation, controllers.getAllEventsByOrganisation);

router.get('/getRegistrationsByIds', verifyJWTOrganisation, controllers.getRegistrationsByIds);

router.get('/getDonorsList', verifyJWTAdmin, controllers.getDonorsList);

router.get('/getOrganisersList', verifyJWTAdmin, controllers.getOrganisersList);

router.post('/bloodDonation', verifyJWTOrganisation, controllers.postBloodDonation);

router.get('/getBloodUnitsList', verifyJWTAdmin, controllers.getBloodUnitsList);

router.post('/bloodReception', verifyJWTAdmin, controllers.postBloodReception);

router.post('/sendCode', controllers.postSendCode);

module.exports = router; 