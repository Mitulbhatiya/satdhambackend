const express = require('express')
const { userData, changePassword, Logout } = require('../../controller/v1/admin/user.admin')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { AddLocationByCSV, deleteLocation, updateLocation, getLocation, newLocation } = require('../../controller/v1/admin/locality.admin')
const { createZone, getZone, updateZone } = require('../../controller/v1/admin/zone.admin')
const { addUser, getUser, getEachUser, updateEachUser, updateUserZone, updateUserActiveStatus, resetUserPassword, setAllAttendanceToZero } = require('../../controller/v1/admin/users.admin')
const { updateUserRole, attendanceAccess } = require('../../controller/v1/admin/role.admin')
const { getAllRequest, updateRequest } = require('../../controller/v1/admin/request.admin')
const { newAttendance, getAttendance, patchAttendance, deleteAttendance, getEachAttendanceData, patchEachAttendanceData, getAttendenceDetails, deleteAttendanceZone, getAttendanceDetailsData } = require('../../controller/v1/admin/attendance.admin')
const { AddUserByCSV } = require('../../controller/v1/admin/addUserDataByCSV.admin')
const { createSubZone, getSubZone, updateSubZone, deleteSubZone } = require('../../controller/v1/admin/subzone.admin')
const { newRemark, getRemark, updateRemark, deleteRemark } = require('../../controller/v1/admin/remarks.admin')
const { newMasterAttendanceKEy, submitMasterAttendance } = require('../../controller/v1/admin/masterAttendance.admin')
const router = express.Router()

// ADMIN
router.get(
    "/userdata",
    isValidAdmin,
    userData
)
// Change Password
router.patch(
    "/update/password",
    isValidAdmin,
    changePassword
)
// logout
router.patch(
    "/logout",
    isValidAdmin,
    Logout
)



//  ========= LOCATION.ADMIN ============

// POST 
router.post(
    "/add/location",
    isValidAdmin,
    newLocation
)
// GET 
router.get(
    "/get/location",
    isValidAdmin,
    getLocation
)
// PATCH 
router.patch(
    "/update/location",
    isValidAdmin,
    updateLocation
)
// DELETE 
router.post(
    "/delete/location",
    isValidAdmin,
    deleteLocation
)
// POST BY CSV 
router.post(
    "/add/locationcsv",
    isValidAdmin,
    AddLocationByCSV
)




//  ========= Zone ============

// POST 
router.post(
    "/zone/add",
    isValidAdmin,
    createZone
)
// GET 
router.get(
    "/zone/get",
    isValidAdmin,
    getZone
)
// PATCH 
router.patch(
    "/zone/update",
    isValidAdmin,
    updateZone
)

// USER ZONE UPDATE (CHANGE) 
router.patch(
    "/zone/userchange",
    isValidAdmin,
    updateUserZone
)


//  ========= subZone ============

// POST 
router.post(
    "/subzone/add",
    isValidAdmin,
    createSubZone
)
// GET 
router.get(
    "/subzone/get",
    isValidAdmin,
    getSubZone
)
// PATCH 
router.patch(
    "/subzone/update",
    isValidAdmin,
    updateSubZone
)
// DELETE 
router.post(
    "/subzone/delete",
    isValidAdmin,
    deleteSubZone
)

//  ========= User ============

// POST 
router.post(
    "/user/add",
    isValidAdmin,
    addUser
)

// GET 
router.get(
    "/user/get",
    isValidAdmin,
    getUser
)
// GET - Each
router.post(
    "/user/get/each",
    isValidAdmin,
    getEachUser
)
// PATCH - Each
router.post(
    "/user/update/each",
    isValidAdmin,
    updateEachUser
)
// PATCH - Active user status
router.patch(
    "/user/update/active",
    isValidAdmin,
    updateUserActiveStatus
)
//  ========= Role ============

// POST 
router.post(
    "/user/role/update",
    isValidAdmin,
    updateUserRole
)

//  ========= Request ============

// GET 
router.get(
    "/request/get",
    isValidAdmin,
    getAllRequest
)

// PATCH 
router.patch(
    "/request/update",
    isValidAdmin,
    updateRequest
)



//  ========= Attendance ============

// POST 
router.post(
    "/attendance/add",
    isValidAdmin,
    newAttendance
)
// GET 
router.get(
    "/attendance/get",
    isValidAdmin,
    getAttendance
)
// PATCh 
router.patch(
    "/attendance/update",
    isValidAdmin,
    patchAttendance
)
// DELETE 
router.post(
    "/attendance/delete",
    isValidAdmin,
    deleteAttendance
)

// GET EACH 
router.post(
    "/attendance/get/each",
    isValidAdmin,
    getEachAttendanceData
)

// PATCH EACH 
router.post(
    "/attendance/update/each",
    isValidAdmin,
    patchEachAttendanceData
)


// ============ Delete Attendance by zone
router.post(
    "/delete/attendance/zone",
    isValidAdmin,
    deleteAttendanceZone
)

//  ========= Attendance details ============

// GET 
router.get(
    "/attendance/details/get",
    isValidAdmin,
    getAttendenceDetails
)

//  ========= Attendance details DAta for analysis in Attendace page (frontend) ============

// GET 
router.get(
    "/attendance/details/data/get",
    isValidAdmin,
    getAttendanceDetailsData
)
//  ========= Attendance Access ============

// POST 
router.post(
    "/attendance/access",
    isValidAdmin,
    attendanceAccess
)



//  ========= REMARK.ADMIN ============

// POST 
router.post(
    "/add/remark",
    isValidAdmin,
    newRemark
)
// GET 
router.post(
    "/get/remark",
    isValidAdmin,
    getRemark
)
// PATCH 
router.patch(
    "/update/remark",
    isValidAdmin,
    updateRemark
)
// DELETE 
router.post(
    "/delete/remark",
    isValidAdmin,
    deleteRemark
)


//  ========= Add user by CSV ============

// POST 
router.post(
    "/user/add/CSV",
    // isValidAdmin,
    AddUserByCSV
)



// =========== Master Attendance key =============

// POST 
router.post(
    "/attendance/master/key",
    isValidAdmin,
    newMasterAttendanceKEy
)

// =========== Master Attendance Submit =============

// POST 
router.post(
    "/attendance/master/submit",
    isValidAdmin,
    submitMasterAttendance
)


// POST - Reset passeword
router.post(
    "/user/password/reset",
    isValidAdmin,
    resetUserPassword
)





// router.get(
//     "/set/attendance/zero",
//     setAllAttendanceToZero
// )
module.exports = router