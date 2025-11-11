// modal
const { newAttendance_joi, patchAttendance_joi, deleteAttendance_joi, patchAttendanceDetails_joi } = require('../../../joi/attendance/attendance.joi');
const Attendance = require('../../../models/attendance/newAttendance')
const AtDetails = require('../../../models/attendance/atdetails')
const User = require("../../../models/user/user.model")

const newAttendance = async (req, res, next) => {
    try {
        const { error, value } = await newAttendance_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            const new_attendance = new Attendance({
                description: value.description,
                zone: value.zone,
                date: value.date,
                createdBy: value.createdBy,
                attendanceTaken: false,
                isActive: true
            })
            await new_attendance.save()
                .then((ress) => {
                    // const filename = req.file.
                    res.status(200).json({
                        message: "Attendance created successfully 😊",
                        result: ress
                    })

                })
                .catch(err => {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                })
        }
    }
    catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}

// GET
const getAttendance = async (req, res, next) => {
    try {
        await Attendance.find({})
            .then((ress) => {
                res.status(200).json({
                    message: "Attendance GET it",
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




const patchAttendance = async (req, res, next) => {
    try {
        const { error, value } = await patchAttendance_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            await Attendance.updateOne({ _id: value._id }, {
                $set: {
                    description: value.description,
                    zone: value.zone,
                    createdBy: value.createdBy,
                    date: value.date,
                }
            })
                .then((ress) => {
                    res.status(200).json({
                        message: "Attendance Updated it",
                        result: value
                    })
                })
                .catch(err => {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                })

        }
    }
    catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


const deleteAttendance = async (req, res, next) => {
    try {
        const { error, value } = await deleteAttendance_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            await Attendance.deleteOne({ _id: value._id })
                .then((ress) => {
                    res.status(200).json({
                        message: "Attendance deleted it",
                        result: {
                            _id: value._id
                        }
                    })
                })
                .catch(err => {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                })

        }
    }
    catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


// GET EACH ATTENDANCE DATA
const getEachAttendanceData = async (req, res, next) => {
    // console.log(req.body);
    try {
        await Attendance.findOne({ _id: req.body._id })
            .then((ress) => {

                AtDetails.find({ attendance: req.body._id })
                    .then((ress2) => {
                        res.status(200).json({
                            message: "Attendance each geted it",
                            result: {
                                attendance: ress,
                                atdetails: ress2
                            }
                        })
                    })
                    .catch(err => {
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                    })
            })
            .catch(err => {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
            })
    }
    catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


// PATCH EACH ATTENDANCE DATA
const patchEachAttendanceData = async (req, res, next) => {
    try {
        const { error, value } = await patchAttendanceDetails_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            // Genrate Object of Present peoples
            switch (value.type) {

                // ========================================= New Attendance =================================
                case 'new':
                    const presentID = []
                    await value.presentID.map((ids) => {
                        presentID.push({
                            isPresent: true,
                            SATID: ids,
                            zone: value.zone,
                            attendance: value.attendance,
                            isActive: true,
                            date: value.date
                        })
                    })
                    // Genrate Object of Absent peoples
                    const absentID = []
                    await value.absentID.map((ids) => {
                        absentID.push({
                            isPresent: false,
                            SATID: ids,
                            zone: value.zone,
                            attendance: value.attendance,
                            isActive: true,
                            date: value.date
                        })
                    })
                    const AttendanceUpdatePromise = await Attendance.updateOne({ _id: value.attendance }, { $set: { attendanceTaken: true } })
                    // Waiting for update promise
                    await Promise.all([AttendanceUpdatePromise]);



                    if (presentID.length === 0) {

                        // Case:
                        // All are absent

                        const absentAttendanceAdd = await AtDetails.insertMany(absentID)
                        // Wait for add operations to complete
                        await Promise.all([absentAttendanceAdd]);

                        if (absentAttendanceAdd.length !== 0) {
                            let flag = 0
                            // Fetch and process attendance for each present ID
                            for (const id of value.absentID) {
                                const num = await AtDetails.find({ SATID: id });
                                let presentNumberCount = 0;
                                const userTotalAttendance = num.length;

                                num.forEach((numValue) => {
                                    if (numValue.isPresent === true) {
                                        presentNumberCount++;
                                    }
                                });
                                const finalUserAttendance = await (Number(presentNumberCount) * 100) / Number(userTotalAttendance)
                                await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                                flag = 1
                            }
                            if (flag === 1) {
                                res.status(200).json({
                                    message: "Attendance updated successfully 😊",
                                })
                            } else {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }
                        }
                        else {
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        }




                    } else if (absentID.length === 0) {


                        // Case :
                        // All are present

                        const presentAttendanceAdd = await AtDetails.insertMany(presentID)
                        // Wait for add operations to complete
                        await Promise.all([presentAttendanceAdd]);

                        if (presentAttendanceAdd.length !== 0) {
                            let flag = 0
                            // Fetch and process attendance for each present ID
                            for (const id of value.presentID) {
                                const num = await AtDetails.find({ SATID: id });
                                let presentNumberCount = 0;
                                const userTotalAttendance = num.length;

                                num.forEach((numValue) => {
                                    if (numValue.isPresent === true) {
                                        presentNumberCount++;
                                    }
                                });
                                const finalUserAttendance = await (Number(presentNumberCount) * 100) / Number(userTotalAttendance)
                                await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                                flag = 1
                            }
                            if (flag === 1) {
                                res.status(200).json({
                                    message: "Attendance updated successfully 😊",
                                })
                            } else {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }
                        } else {
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        }

                    } else {

                        // Case :
                        // Some are present and some are absent

                        const absentAttendanceAdd = await AtDetails.insertMany(absentID)
                        const presentAttendanceAdd = await AtDetails.insertMany(presentID)
                        // Wait for both of add operations to complete
                        await Promise.all([absentAttendanceAdd, presentAttendanceAdd]);

                        if (presentAttendanceAdd.length !== 0 && absentAttendanceAdd.length !== 0) {
                            let flag = 0
                            // Fetch and process attendance for each present ID
                            for (const id of value.presentID) {
                                const num = await AtDetails.find({ SATID: id });
                                let presentNumberCount = 0;
                                const userTotalAttendance = num.length;

                                num.forEach((numValue) => {
                                    if (numValue.isPresent === true) {
                                        presentNumberCount++;
                                    }
                                });
                                const finalUserAttendance = await (Number(presentNumberCount) * 100) / Number(userTotalAttendance)
                                await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                                flag = 1
                            }
                            for (const id of value.absentID) {
                                const num = await AtDetails.find({ SATID: id });
                                let presentNumberCount = 0;
                                const userTotalAttendance = num.length;

                                num.forEach((numValue) => {
                                    if (numValue.isPresent === true) {
                                        presentNumberCount++;
                                    }
                                });
                                const finalUserAttendance = await (Number(presentNumberCount) * 100) / Number(userTotalAttendance)
                                await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                                flag = 2
                            }
                            // console.log(flag);
                            if (flag === 2) {
                                res.status(200).json({
                                    message: "Attendance updated successfully 😊",
                                })
                            } else {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }
                        } else {
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        }

                    }
                    break;

                // ========================================= Update Attendance =================================

                case 'update':

                    if (value.presentID.length === 0) {

                        // Case:
                        //  All are absent

                        const absentAttendance = await AtDetails.updateMany(
                            { $and: [{ SATID: { $in: value.absentID } }, { attendance: value.attendance }] },
                            { $set: { isPresent: false } }
                        )
                        // Wait for update operations to complete
                        await Promise.all([absentAttendance]);

                        if (absentAttendance.matchedCount !== 0) {
                            let flag = 0
                            // Fetch and process attendance for each present ID
                            for (const id of value.absentID) {
                                const num = await AtDetails.find({ SATID: id });
                                let presentNumberCount = 0;
                                const userTotalAttendance = num.length;
                                // console.log(userTotalAttendance);
                                num.forEach((numValue) => {
                                    if (numValue.isPresent === true) {
                                        presentNumberCount++;
                                    }
                                });
                                const finalUserAttendance = await (Number(presentNumberCount) * 100) / Number(userTotalAttendance)
                                if (userTotalAttendance === 0) {
                                    await User.updateOne({ _id: id }, { $set: { attendance: 0 } })
                                } else {
                                    // console.log(finalUserAttendance !== NaN);
                                    // console.log(parseFloat(finalUserAttendance.toFixed(2)));
                                    await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                                }
                                // await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                                flag = 1
                            }
                            if (flag === 1) {
                                res.status(200).json({
                                    message: "Attendance updated successfully 😊",
                                })
                            } else {
                                // console.log("cc");
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }
                        }
                        else {
                            // console.log("called--");
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        }



                    } else if (value.absentID.length === 0) {



                        // Case :
                        // All are present
                        const presentAttendance = await AtDetails.updateMany(
                            { $and: [{ SATID: { $in: value.presentID } }, { attendance: value.attendance }] },
                            { $set: { isPresent: true } }
                        )

                        // Wait for update operations to complete
                        await Promise.all([presentAttendance]);

                        if (presentAttendance.matchedCount !== 0) {
                            let flag = 0
                            // Fetch and process attendance for each present ID
                            for (const id of value.presentID) {
                                const num = await AtDetails.find({ SATID: id });
                                let presentNumberCount = 0;
                                const userTotalAttendance = num.length;
                                // console.log(userTotalAttendance);
                                num.forEach((numValue) => {
                                    if (numValue.isPresent === true) {
                                        presentNumberCount++;
                                    }
                                });

                                const finalUserAttendance = await (Number(presentNumberCount) * 100) / Number(userTotalAttendance)

                                if (userTotalAttendance === 0) {
                                    await User.updateOne({ _id: id }, { $set: { attendance: 0 } })
                                } else {
                                    // console.log(finalUserAttendance !== NaN);
                                    // console.log(parseFloat(finalUserAttendance.toFixed(2)));
                                    await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                                }
                                // await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                                flag = 1
                            }
                            if (flag === 1) {
                                res.status(200).json({
                                    message: "Attendance updated successfully 😊",
                                })
                            } else {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }
                        }
                        else {
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        }




                    } else {

                        // Case :
                        // Some present and some absent
                        const presentAttendance = await AtDetails.updateMany(
                            { $and: [{ SATID: { $in: value.presentID } }, { attendance: value.attendance }] },
                            { $set: { isPresent: true } }
                        )

                        const absentAttendance = await AtDetails.updateMany(
                            { $and: [{ SATID: { $in: value.absentID } }, { attendance: value.attendance }] },
                            { $set: { isPresent: false } }
                        )

                        // Wait for both update operations to complete
                        await Promise.all([presentAttendance, absentAttendance]);

                        // Fetch and process attendance for each present ID
                        // if (presentAttendance.matchedCount !== 0 && absentAttendance.matchedCount !== 0) {

                        let flag = 0
                        // Fetch and process attendance for each present ID
                        for (const id of value.presentID) {
                            const num = await AtDetails.find({ SATID: id });
                            let presentNumberCount = 0;
                            const userTotalAttendance = num.length;
                            // console.log(userTotalAttendance);
                            num.forEach((numValue) => {
                                if (numValue.isPresent === true) {
                                    presentNumberCount++;
                                }
                            });
                            const finalUserAttendance = await (Number(presentNumberCount) * 100) / Number(userTotalAttendance)
                            if (userTotalAttendance === 0) {
                                await User.updateOne({ _id: id }, { $set: { attendance: 0 } })
                            } else {
                                // console.log(finalUserAttendance !== NaN);
                                // console.log(parseFloat(finalUserAttendance.toFixed(2)));
                                await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                            }
                            flag = 1
                        }
                        for (const id of value.absentID) {
                            const num = await AtDetails.find({ SATID: id });
                            let presentNumberCount = 0;
                            const userTotalAttendance = num.length;
                            // console.log(userTotalAttendance);
                            num.forEach((numValue) => {
                                if (numValue.isPresent === true) {
                                    presentNumberCount++;
                                }
                            });
                            // console.log(presentNumberCount, userTotalAttendance);
                            const finalUserAttendance = await (Number(presentNumberCount) * 100) / Number(userTotalAttendance)
                            // console.log(parseFloat(finalUserAttendance.toFixed(2)));
                            if (userTotalAttendance === 0) {
                                await User.updateOne({ _id: id }, { $set: { attendance: 0 } })
                            } else {
                                // console.log(finalUserAttendance !== NaN);
                                // console.log(parseFloat(finalUserAttendance.toFixed(2)));
                                await User.updateOne({ _id: id }, { $set: { attendance: parseFloat(finalUserAttendance.toFixed(2)) } })
                            }
                            // await User.updateOne({ _id: id }, { $set: { attendance: finalUserAttendance === NaN ? 0 : parseFloat(finalUserAttendance.toFixed(2)) } })
                            flag = 2
                        }
                        // console.log(flag);
                        if (flag === 2) {
                            res.status(200).json({
                                message: "Attendance updated successfully 😊",
                            })
                        } else {
                            // console.log("called");
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        }
                        // }
                        // else {
                        //     // console.log("called!!");
                        //     res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        // }
                        // await AtDetails.updateMany(
                        //     { SATID: { $in: value.presentID } },
                        //     { $set: { isPresent: true } }
                        // )
                        //     .then((ress1) => {
                        //         AtDetails.updateMany(
                        //             { SATID: { $in: value.absentID } },
                        //             { $set: { isPresent: false } }
                        //         )
                        //             .then((ress2) => {

                        //                 let flag = 0
                        //                 value.presentID.map((ids) => {
                        //                     AtDetails.find({ SATID: ids })
                        //                         .then(num => {
                        //                             // console.log(num);
                        //                             let presentNumberCount = 0
                        //                             const userTodatlAttendance = num.length
                        //                             num.map((numValue) => {
                        //                                 if (numValue.isPresent === true) {
                        //                                     presentNumberCount = presentNumberCount + 1
                        //                                 }
                        //                             })
                        //                             console.log((presentNumberCount * 100) / userTodatlAttendance, "%", "-", ids);
                        //                             flag = 1
                        //                         })
                        //                         .catch(err => {
                        //                             console.log(err);
                        //                         })
                        //                 })
                        //                 console.log("flag", flag);
                        //                 // res.status(200).json({
                        //                 //     message: "Attendance updated successfully 😊",
                        //                 // })

                        //             })
                        //             .catch(err => {
                        //                 res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        //             })

                        //     })
                        //     .catch(err => {
                        //         res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        //     })
                    }
                    break;
                default:
                    break;
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}





// =========== Attendance detsils ===============

const getAttendenceDetails = async (req, res, next) => {
    try {
        await AtDetails.find({})
            .then((ress) => {
                res.status(200).json({
                    message: "Attendance details GET it",
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



// ==============================================================================================================


const getAttendanceDetailsData = async (req, res, next) => {
    try {
        await AtDetails.find({})
            .then((ress) => {

                const result = Object.values(ress.reduce((acc, { attendance, isPresent, date, zone }) => {
                    const key = `${date}-${attendance}-${zone}`;
                    acc[key] = acc[key] || { date, attendance, zone, isPresent: 0, total: 0 };
                    acc[key].isPresent += isPresent;
                    acc[key].total++;
                    return acc;
                }, {}));

                Promise.all([result]);

                res.status(200).json({
                    message: "Attendance details Data GET it",
                    result: result
                })
            })
            .catch(err => {
                console.log(err);
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
            })
    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


// Delete attandance by zone

const deleteAttendanceZone = async (req, res, next) => {
    try {
        const body = req.body
        await AtDetails.deleteMany({ zone: body.zone })
            .then((ress) => {
                Attendance.deleteMany({ zone: body.zone })
                    .then((ress) => {
                        User.updateMany({ zone: body.zone }, { $set: { attendance: 0 } })
                            .then((ress) => {
                                res.status(200).json({
                                    message: "Attendance deleted and user updated",
                                })
                            })
                            .catch(err => {
                                // console.log(err);
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                            })
                    })
                    .catch(err => {
                        // console.log(err);
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
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
module.exports = { newAttendance, getAttendance, patchAttendance, deleteAttendance, getEachAttendanceData, patchEachAttendanceData, getAttendenceDetails, deleteAttendanceZone, getAttendanceDetailsData }