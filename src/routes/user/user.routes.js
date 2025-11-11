const express = require('express')
const isValidUser = require('../../helper/auth/user.auth')
const { userData, changePassword, Logout } = require('../../controller/v1/user/userdata.user')
const { addUserReq, updateDetailsReq, patch_req, getRequestByZone } = require('../../controller/v1/user/request.user')
const { getUserDataByZone } = require('../../controller/v1/user/zoneuser.use')
const { getAttendanceByZone, getAttendancedetailsByZone } = require('../../controller/v1/user/attendance.user')
const { newAttendance, patchAttendance, deleteAttendance, getEachAttendanceData, patchEachAttendanceData, getAttendanceDetailsData } = require('../../controller/v1/admin/attendance.admin')
const { getSubZoneByZone } = require('../../controller/v1/user/subzone.user')
const { newRemark, getRemark, updateRemark, deleteRemark } = require('../../controller/v1/admin/remarks.admin')
const router = express.Router()


// USER DATA
router.get(
    "/userdata",
    isValidUser,
    userData
)


// REQUEST

// GET REQ
router.post(
    "/req/get/zone",
    isValidUser,
    getRequestByZone
)

// Add USER
router.post(
    "/req/add",
    isValidUser,
    addUserReq
)

// UPDATE USER DETAILS (PATCH)
router.post(
    "/req/update",
    isValidUser,
    updateDetailsReq
)
// PATCh REQ
router.post(
    "/req/patch",
    isValidUser,
    patch_req
)


// Change Password
router.post(
    "/update/password",
    isValidUser,
    changePassword
)

// ogout
router.post(
    "/logout",
    isValidUser,
    Logout
)


// GET USER DATA BY ZONE.

router.post(
    "/get/userdata/zone",
    isValidUser,
    getUserDataByZone
)


// Attendance=============

// GET by zone
router.post(
    "/get/main/attendance",
    isValidUser,
    getAttendanceByZone
)

// Add new main attendance
router.post(
    "/post/main/attendance",
    isValidUser,
    newAttendance
)
// Patch-Update new main attendance
router.patch(
    "/patch/main/attendance",
    isValidUser,
    patchAttendance
)
// Add new main attendance
router.delete(
    "/delete/main/attendance",
    isValidUser,
    deleteAttendance
)



// Attendance details

router.post(
    "/get/details/attendance",
    isValidUser,
    getAttendancedetailsByZone
)

// Get each attendance data
router.post(
    "/get/details/attendance/each",
    isValidUser,
    getEachAttendanceData
)
// Patch each attendance data
router.post(
    "/submit/details/attendance",
    isValidUser,
    patchEachAttendanceData
)




// GET SUB ZONE

router.post(
    "/get/subzone",
    isValidUser,
    getSubZoneByZone
)



//  ========= REMARK.USER ============

// POST 
router.post(
    "/add/remark",
    isValidUser,
    newRemark
)
// GET 
router.post(
    "/get/remark",
    isValidUser,
    getRemark
)
// PATCH 
router.patch(
    "/update/remark",
    isValidUser,
    updateRemark
)
// DELETE 
router.post(
    "/delete/remark",
    isValidUser,
    deleteRemark
)



//  ========= Attendance details DAta for analysis in Attendace page (frontend) ============

// GET 
router.get(
    "/attendance/details/data/get",
    isValidUser,
    getAttendanceDetailsData
)

module.exports = router