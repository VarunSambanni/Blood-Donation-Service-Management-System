const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const getStream = require('get-stream');
const { v4: uuidv4 } = require('uuid');


const Organisation = require('../models/organisations');
const Donor = require('../models/donors');
const Event = require('../models/events');
const Registration = require('../models/registrations');
const Donation = require('../models/donations');
const BloodUnit = require('../models/bloodunits');
const Reception = require('../models/receptions');
const unverifiedUsers = require('../models/unverifiedUsers');

const getTime = () => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return [year + "-" + month + "-" + date, hours + ":" + minutes + ":" + seconds];
}

const transport = nodemailer.createTransport(
    {
        service: 'hotmail',
        auth: {
            user: process.env.TRANSPORTER_EMAIL,
            pass: process.env.TRANSPORTER_EMAIL_PASSWORD
        }
    }
);


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
            const token = jwt.sign({}, process.env.JWT_SECRET_DONOR, {
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
            const token = jwt.sign({}, process.env.JWT_SECRET_ORGANISATION, {
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
            const token = jwt.sign({}, process.env.JWT_SECRET_ADMIN, {
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
    return res.status(200).json({ success: true, msg: "Successfully Authenticated" });
}

exports.postSignupDonor = (req, res, next) => {
    console.log("Signing up donor : ", req.body.email);
    const code = req.body.code;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const phone_no = req.body.phone_no;
    const blood_type = req.body.blood_type;
    const donor = new Donor(null, email, password, phone_no, blood_type);

    if (/\S+@\S+\.\S+/.test(email) === false || password.length < 8 || password !== confirmPassword) {
        return res.json({ success: false, msg: "Enter valid inputs" });
    }

    Donor.findByEmail(email)
        .then(data => {
            if (data[0].length !== 0) {
                return res.json({ success: false, msg: "Donor already exists" });
            }

            unverifiedUsers.findOne({ email: email })
                .then(unverifiedUserData => {
                    if (unverifiedUserData.code !== code) {
                        return res.json({ success: false, msg: "Invalid code" });
                    }
                    if (((new Date()).getTime() / 1000) - parseInt(unverifiedUserData.time) >= 600) {
                        unverifiedUsers.findOneAndDelete({ email: email })
                            .then(result => {

                            })
                            .catch(err => {
                                console.log("Error deleting from unverifiedUsers ", err);
                            })
                        return res.json({ success: false, msg: "Code expired, restart sign up process" });
                    }
                    donor.save()
                        .then((data) => {
                            unverifiedUsers.findOneAndDelete({ email: email })
                                .then(result => {

                                })
                                .catch(err => {
                                    console.log("Error deleting from unverifiedUsers ", err);
                                })
                            var mailOptions = {
                                from: process.env.TRANSPORTER_EMAIL,
                                to: email,
                                subject: 'Signup Successful',
                                text: `Thank you for signing up on BLOOD DONATION SERVICE MANAGEMENT SYSTEM. Your ID : ${data[0].insertId}`,
                                html: `<h2>Thank you for signing up on BLOOD DONATION SERVICE MANAGEMENT SYSTEM.<br/>Your ID : ${data[0].insertId} </h2>`
                            }
                            transport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.log("Error sending mail for blood donation");
                                }
                                console.log(`Thank you for signing up on BLOOD DONATION SERVICE MANAGEMENT SYSTEM. Your ID : ${data[0].insertId}`);
                            })
                            return res.json({ success: true, msg: "Signed Up Successfully" });
                        })
                        .catch(err => {
                            console.log("Error signing up ", err)
                            return res.json({ success: false, msg: "Signup Unsuccessful" })
                        })
                })
                .catch(err => {
                    console.log("Error finding user ", err);
                    return res.json({ success: false, msg: "Error finding user" });
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

exports.postRegisterEvent = (req, res, next) => {
    const donor_id = req.body.donor_id;
    const event_id = req.body.event_id;
    console.log(Number(donor_id), " registering for event ", event_id);
    const registartion = new Registration(donor_id, event_id);
    registartion.save()
        .then(data => {
            return res.json({ success: true, msg: "Event registration successful" });
        })
        .catch(err => {
            console.log("Error registering ", err);
            return res.json({ success: false, msg: "Error Registering" });
        })
}

exports.getAllEventsByOrganisation = (req, res, next) => {
    const org_id = req.body.org_id;
    Event.getEventsByOrgId(org_id)
        .then(data => {
            return res.json({ success: true, data: data[0] });
        })
        .catch(err => {
            console.log("Error fetching events for the organisation ", err);
            return res.json({ success: false, msg: "Error Fetching Events For The Organisation" });
        })

}

exports.getRegistrationsByIds = (req, res, next) => {

    Registration.getRegistrationsByIds()
        .then(data => {
            let newData = {};
            for (let i = 0; i < data[0].length; i++) {
                if (data[0][i].event_id in newData === false) {
                    newData[data[0][i].event_id] = [{ donor_id: data[0][i].donor_id, email: data[0][i].email, phone_no: data[0][i].phone_no, blood_type: data[0][i].blood_type }];
                }
                else {
                    newData[data[0][i].event_id].push({ donor_id: data[0][i].donor_id, email: data[0][i].email, phone_no: data[0][i].phone_no, blood_type: data[0][i].blood_type });
                }
            }
            console.log(newData);
            return res.json({ success: true, data: newData });
        })
        .catch(err => {
            console.log("Error fetching registered users ", err);
            return res.json({ success: false, msg: "Error fetching registered users" });
        })
}


exports.getDonorsList = (req, res, next) => {
    Donor.fetchAll()
        .then(data => {
            return res.json({ success: true, data: data[0] });
        })
        .catch(err => {
            console.log("Error fetching donors list ", err);
            return res.json({ success: false, msg: "Error fetching donors list" });
        })
}

exports.getOrganisersList = (req, res, next) => {
    Organisation.fetchAll()
        .then(data => {
            return res.json({ success: true, data: data[0] });
        })
        .catch(err => {
            console.log("Error fetching organisers list ", err);
            return res.json({ success: false, msg: "Error fetching organisers list" });
        })
}

//Add donor verification


exports.postBloodDonation = (req, res, next) => {
    const donor_id = req.body.donor_id;
    const name = req.body.name;
    const blood_type = req.body.blood_type;
    const donation = new Donation(null, blood_type, donor_id);

    donation.save()
        .then(() => {
            donation.fetchAll()
                .then(data => {
                    const don_id = data[0][data[0].length - 1].don_id;
                    const bloodUnit = new BloodUnit(null, blood_type, don_id);
                    bloodUnit.save()
                        .then(() => {
                            Donor.findById(donor_id)
                                .then(data => {

                                    const doc = new PDFDocument();
                                    doc.font('Helvetica').fontSize(20)
                                    doc.text('BLOOD DONATION SERVICE MANAGEMENT SYSTEM', { align: 'center', underline: true })
                                    doc.moveDown();
                                    doc.moveDown();
                                    doc.moveDown();
                                    doc.moveDown();
                                    doc.font('Helvetica').fontSize(14);
                                    doc.text(`Name : ${name}`, { align: 'left' });
                                    doc.text(`Donor ID : ${data[0][0].donor_id}`, { align: 'left' });
                                    doc.text(`Email : ${data[0][0].email}`, { align: 'left' })
                                    doc.text(`Blood Type : ${data[0][0].blood_type}`, { align: 'left' })
                                    doc.text(`Date of Donation : ${getTime()[0]}`, { align: 'left' })
                                    doc.text(`Time of Donation : ${getTime()[1]}`, { align: 'left' })
                                    doc.moveDown();
                                    doc.moveDown();
                                    doc.text('Thank you for you kind gesture for voluntarily donating one unit of blood.', { align: 'center' });
                                    doc.moveDown();
                                    doc.moveDown();
                                    doc.moveDown();
                                    doc.moveDown();
                                    doc.text('POST DONATION ADVICE', { aligh: 'left', underline: true });
                                    doc.font('Helvetica').fontSize(12);
                                    doc.moveDown();
                                    doc.moveDown();
                                    doc.list(['Do not smoke or drink alcohol for 1 hour after blood donation.',
                                        'Drink plenty of fluids after donation. The blood that you have donated is made up in quantity (volume) in 24-26 hourse. Do not donate blood for the next 3 months for Male & 4 months for female.',
                                        'You may remove band aid after 24 hours. If there is bleeding from the site raise the arm and apply pressure. Avoid vigorous physical exercise after blood donation for the day.',
                                        'If you feel giddy lay down by raising your foot end',
                                        'You may resume your routine work soon after donation. However you are cautioned that you are working in hazardous occupations like construction at a heigh or operating dizziness may occur',
                                        'For further information, please mail us at : blooddonationservicemanagement@outlook.com or call us at : 080-2313-4121'
                                    ])
                                    doc.end();
                                    getStream.buffer(doc)
                                        .then(buffer => {
                                            var mailOptions = {
                                                from: process.env.TRANSPORTER_EMAIL,
                                                to: data[0][0].email,
                                                subject: 'Successful Blood Donation',
                                                text: `Thank you for donating blood, here's your donation report`,
                                                html: `<h2>Thank you for donating blood, here's your donation report</h2>`,
                                                attachments: [{
                                                    filename: "donation-report.pdf",
                                                    content: buffer
                                                }]
                                            }
                                            transport.sendMail(mailOptions, (err, info) => {
                                                if (err) {
                                                    console.log("Error sending mail for blood donation");
                                                }
                                            })
                                        })
                                        .catch(err => {
                                            console.log("Error converting pdf to stream ", err);
                                        })
                                })
                                .catch(err => {
                                    console.log("Error finding donor_id for donation ", err);
                                })
                            return res.json({ success: true, msg: "Donation made successfully" });
                        })
                        .catch(err => {
                            console.log("Error making donation ", err);
                            return res.json({ success: false, msg: "Error making donation" });
                        })
                })
                .catch(err => {
                    console.log("Error making donation ", err);
                    return res.json({ success: false, msg: "Error making donation" });
                })
        })
        .catch(err => {
            console.log("Error making donation ", err);
            return res.json({ success: false, msg: "Error making donation" });
        })
}

exports.getBloodUnitsList = (req, res, next) => {
    BloodUnit.fetchAll()
        .then(data => {
            return res.json({ success: true, data: data[0] });
        })
        .catch(err => {
            console.log("Error fetching bloodunits list ", err);
            return res.json({ success: false, msg: "Error fetching bloodunits list" });
        })
}

exports.postBloodReception = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone_no = req.body.phone_no;
    const blood_type = req.body.blood_type;

    BloodUnit.findByBloodType(blood_type)
        .then(data => {
            if (data[0].length === 0) {
                return res.json({ success: false, msg: `No ${blood_type} blood units available` });
            }
            const unit_id = data[0][data[0].length - 1].unit_id;
            const reception = new Reception(null, name, email, phone_no, blood_type, unit_id);
            reception.save()
                .then(() => {
                    BloodUnit.deleteById(unit_id)
                        .then(() => {
                            return res.json({ success: true, msg: "Reception made successfully" });
                        })
                        .catch(err => {
                            console.log("Error making reception ", err);
                            return res.json({ success: false, msg: "Error making reception" });
                        })
                })
                .catch(err => {
                    console.log("Error making reception ", err);
                    return res.json({ success: false, msg: "Error making reception" });
                })
        })
        .catch(err => {
            console.log("Error making reception ", err);
            return res.json({ success: false, msg: "Error making reception" });
        })
}

exports.postSendCode = (req, res, next) => {
    const email = req.body.email;
    const code = uuidv4();
    if (/\S+@\S+\.\S+/.test(email) === false) {
        return res.json({ success: false, msg: "Enter valid inputs" });
    }
    var mailOptions = {
        from: process.env.TRANSPORTER_EMAIL,
        to: email,
        subject: 'Code for your signup',
        text: `Your code: ${code}, expires in 10 minutes`,
        html: `<h2> Your code: ${code}, expires in 10 minutes </h2>`
    }

    Donor.findByEmail(email)
        .then(donorData => {
            if (donorData[0].length > 0) {
                return res.json({ success: false, msg: "Email ID already in use" });
            }
            unverifiedUsers.findOneAndDelete({ email: email })
                .then(result => {
                    const unverifiedUser = new unverifiedUsers({
                        email: email,
                        code: code,
                        time: (new Date()).getTime() / 1000
                    });
                    unverifiedUser.save()
                        .then(result => {
                            transport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.log("Error sending mail");
                                    return res.json({ success: false, msg: "Error sending mail" });
                                }
                                return res.json({ success: true, msg: "Code sent to your email" });
                            })
                        })
                        .catch(err => {
                            console.log("Error sending code ", err);
                            return res.json({ success: false, msg: "Error sending code" });
                        })
                })
                .catch(err => {
                    console.log("Error finding and deleting in unverifiedUsers ", err);
                    return res.json({ success: false, msg: "Error sending code" });
                })
        })
        .catch(err => {
            console("Error sending code ", err);
            return res.json({ success: false, msg: "Error sending code" });
        })
}