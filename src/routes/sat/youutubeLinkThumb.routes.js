const express = require('express')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { postUpload, getUpload, updateUpload, deleteUpload } = require('../../controller/v1/sat/youtubeLinkThumb')
const router = express.Router()


router.post(
    "/post",
    isValidAdmin,
    postUpload
)

router.post(
    "/get",
    // isValidAdmin,
    getUpload
)

// Update API for Image
router.patch(
    "/patch",
    isValidAdmin,
    updateUpload
)
// // Update API for Data
// router.patch(
//     "/patch/data",
//     isValidAdmin,
//     updateUploadFileData
// )


router.delete(
    "/delete",
    isValidAdmin,
    deleteUpload
)
module.exports = router