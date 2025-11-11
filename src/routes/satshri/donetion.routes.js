const express = require('express')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { AddData, GetData, updateData, deleteData } = require('../../controller/v1/satshri/donetion.controller')
const router = express.Router()


router.post(
    "/post",
    isValidAdmin,
    AddData
)

router.post(
    "/get",
    isValidAdmin,
    GetData
)
router.patch(
    "/patch",
    isValidAdmin,
    updateData
)
router.delete(
    "/delete",
    isValidAdmin,
    deleteData
)

module.exports = router