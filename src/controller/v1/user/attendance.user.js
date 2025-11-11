const Attendance = require('../../../models/attendance/newAttendance')
const AtDetails = require('../../../models/attendance/atdetails')
const User = require("../../../models/user/user.model")


// GET main attendance by Zone
const getAttendanceByZone = async (req, res, next) => {
    try {
        await Attendance.find({ zone: req.body.zone })
            .then((ress) => {
                res.status(200).json({
                    message: "main attendance GET it",
                    result: ress
                })
            })
            .catch(err => {
                // console.log(err);
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
            })
    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


// GET  attendance details by Zone
const getAttendancedetailsByZone = async (req, res, next) => {
    try {
        await AtDetails.find({ zone: req.body.zone })
            .then((ress) => {
                res.status(200).json({
                    message: "main attendance GET it",
                    result: ress
                })
            })
            .catch(err => {
                // console.log(err);
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
            })
    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}

module.exports = { getAttendanceByZone, getAttendancedetailsByZone }