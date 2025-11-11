const express = require('express')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { newUser, getUser, updateEachUserData, addImage, updateImage, deleteUpload } = require('../../controller/v1/satshri/users.controller')
const router = express.Router()


router.post(
    "/post",
    isValidAdmin,
    newUser
)
router.get(
    "/get",
    isValidAdmin,
    getUser
)
router.patch(
    "/patch/data",
    isValidAdmin,
    updateEachUserData
)
router.patch(
    "/patch/add/img",
    isValidAdmin,
    addImage
)
router.patch(
    "/patch/change/img",
    isValidAdmin,
    updateImage
)
router.delete(
    "/delete",
    isValidAdmin,
    deleteUpload
)

module.exports = router