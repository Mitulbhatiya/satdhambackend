
const { role_subuser_joi, role_attendance_joi } = require('../../../joi/role/role.joi');
const Users = require('../../../models/user/user.model')

const updateUserRole = async (req, res, next) => {
    try {
        const { error, value } = await role_subuser_joi.validate(req.body)
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            switch (value.type) {
                case 'subuser':
                    await Users.updateMany(
                        { _id: { $in: value.user } },
                        { $set: { role: "zonesubadmin" } })
                        .then((result1) => {
                            Users.find({})
                                .then((ress) => {
                                    res.status(200).json({
                                        message: "Users Role updated",
                                        result: ress
                                    })
                                })
                                .catch(err => {
                                    // console.log(err);
                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                                })
                        })
                        .catch((err) => {
                            res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
                        })
                    break;

                case 'user':
                    await Users.updateMany(
                        { _id: { $in: value.user } },
                        { $set: { role: "user", attendancePermission: false } })
                        .then((result1) => {
                            Users.find({})
                                .then((ress) => {
                                    res.status(200).json({
                                        message: "Users Role updated",
                                        result: ress
                                    })
                                })
                                .catch(err => {
                                    // console.log(err);
                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                                })
                        })
                        .catch((err) => {
                            res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
                        })
                    break;

                case 'admin':
                    await Users.updateMany(
                        { _id: { $in: value.user } },
                        { $set: { role: "admin" } })
                        .then((result1) => {
                            Users.find({})
                                .then((ress) => {
                                    res.status(200).json({
                                        message: "Users Role updated",
                                        result: ress
                                    })
                                })
                                .catch(err => {
                                    // console.log(err);
                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                                })
                        })
                        .catch((err) => {
                            res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
                        })
                    break;
                default:
                    break;
            }

        }


    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}



// Attendance Access (Change Role)

const attendanceAccess = async (req, res, next) => {
    try {
        const { error, value } = await role_attendance_joi.validate(req.body)
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            await Users.updateOne(
                { _id: value.userId },
                { $set: { attendancePermission: value.attendanceAccess } })
                .then((result1) => {
                    res.status(200).json({
                        message: "Users Role updated",
                        result: {
                            _id: value.userId,
                            attendancePermission: value.attendanceAccess
                        }
                    })
                })
                .catch(err => {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                })
        }
    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}
module.exports = { updateUserRole, attendanceAccess }