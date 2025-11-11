const Attendance = require('../../../models/attendance/newAttendance')
const AtDetails = require('../../../models/attendance/atdetails')
const User = require("../../../models/user/user.model")


const newMasterAttendanceKEy = async (req, res, next) => {
    // console.log(req.body);
    try {
        // const new_attendance = new Attendance(req.body)
        await Attendance.insertMany(req.body)
            .then((ress) => {
                // const filename = req.file.
                res.status(200).json({
                    message: "Attendance created successfully 😊",
                    result: ress
                })

            })
            .catch(err => {
                // console.log(err);
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
            })
    }
    catch (err) {
        // console.log(err);
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }

}




const submitMasterAttendance = async (req, res, next) => {

    try {
        const value = req.body
        // console.log(value);

        const presentID = []
        const onlyPresentID = []
        await value.presentID.map((val) => {
            const res = value.mainAttendance?.filter(atDetails =>
                (atDetails.zone.toUpperCase().includes(val.zone.toUpperCase()))
            )
            presentID.push({
                isPresent: true,
                SATID: val._id,
                zone: val.zone,
                attendance: res[0]._id,
                isActive: true,
                date: res[0].date
            })
            onlyPresentID.push(val._id)
        })

        const absentID = []
        const onlyAbsentID = []
        await value.absentID.map((val) => {
            const res = value.mainAttendance?.filter(atDetails =>
                (atDetails.zone.toUpperCase().includes(val.zone.toUpperCase()))
            )
            absentID.push({
                isPresent: false,
                SATID: val._id,
                zone: val.zone,
                attendance: res[0]._id,
                isActive: true,
                date: res[0].date
            })
            onlyAbsentID.push(val._id)
        })



        const mainAttendance = []
        await value.mainAttendance.map((val) => {
            mainAttendance.push(val._id)
        })
        // console.log(mainAttendance);

        const AttendanceUpdatePromise = await Attendance.updateMany({ _id: { $in: mainAttendance } }, { $set: { attendanceTaken: true } })
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
                for (const id of onlyAbsentID) {
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
                for (const id of onlyPresentID) {
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
                for (const id of onlyPresentID) {
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
                for (const id of onlyAbsentID) {
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

    }
    catch (err) {
        console.log(err);
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}

module.exports = { newMasterAttendanceKEy, submitMasterAttendance }



// User.updateMany({}, { $set: { attendance: 0 } })
// .then((ress) => {
//     // const filename = req.file.
//     res.status(200).json({
//         message: "Attendance created successfully 😊",
//         result: ress
//     })

// })
// .catch(err => {
//     console.log(err);
//     res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
// })