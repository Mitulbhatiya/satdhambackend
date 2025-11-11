
const Users = require('../../../models/user/user.model')
const multer = require("multer")
const bcrypt = require('bcrypt')
const csv = require('csvtojson')

var upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "text/csv") {
            cb(null, true);
        } else {
            // req.ErrorFromMulter = 'Only .png, .jpg and .jpeg format allowed and file size should be less then   1 MB';
            // cb(null, false);
            return cb(new Error('Only csv format allowed!'));
        }
    },
}).single("userCSV")

// POST By CSV
const AddUserByCSV = async (req, res, next) => {
    upload(req, res, async function (err) {
        const body = req.body;
        // console.log(req.file);

        if (err) {
            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        } else {
            let users = await Users.countDocuments();
            const saltRounds = 12
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync("sat@123", salt);
            await csv().fromString(req.file.buffer.toString())
                .then(
                    async json => {
                        json.map(location => {
                            location.firstname = location["FNAME"];
                            location.middlename = location["MNAME"];
                            location.lastname = location["LNAME"];
                            location.gender = location["GENDER"];
                            location.mobile = location["MOBILE"];
                            location.district = location["DISTRICT"];
                            location.taluka = location["TALUKA"];
                            location.village = location["VILLAGE"];

                            const [day, month, year] = location["BIRTHDATE"].split('-');
                            const utcDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-based
                            location.birthdate = utcDate.toISOString().split('T')[0]; // Convert to UTC ISO string

                            // location.birthdate = location["BIRTHDATE"];
                            location.address = location["ADDRESS"];
                            location.zone = location["ZONE"];
                            location.subzone = location["SUBZONE"];
                            location.vistar = location["AREA"];
                            location.ID = `SATP${users + 1}`;
                            location.password = hash;
                            location.profileurl = `SATP${users + 1}.png`;
                            location.profilePhotoStatus = false;
                            location.linked = false;
                            location.role = "user";
                            location.attendancePermission = false;
                            location.attendance = 0;
                            location.isActive = true
                            users = users + 1
                        })
                        const cleanedArray = json.map(entry => {
                            // Remove unwanted keys
                            delete entry.FNAME;
                            delete entry.MNAME;
                            delete entry.LNAME;
                            delete entry.GENDER;
                            delete entry.MOBILE;
                            delete entry.DISTRICT;
                            delete entry.TALUKA;
                            delete entry.VILLAGE;
                            delete entry.BIRTHDATE;
                            delete entry.ADDRESS;
                            delete entry.ZONE;
                            delete entry.SUBZONE;
                            delete entry.AREA;

                            return entry;
                        });
                        // console.log(cleanedArray.length);
                        await Users.insertMany(cleanedArray)
                            .then((ress) => {
                                res.status(200).json({
                                    message: "User created successfully 😊",
                                    result: ress
                                })

                            })
                            .catch(err => {
                                console.log(err);
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on data save without img" })
                            })
                    })
        }

    })
}



module.exports = { AddUserByCSV }