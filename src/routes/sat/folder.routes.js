const express = require('express')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { postFolder, getFolder, updateFolder, updateFolderLinkStatus, deleteFolder, makeThumbnail, makeBanner } = require('../../controller/v1/sat/folder')
const router = express.Router()


router.post(
    "/post",
    isValidAdmin,
    postFolder
)

router.get(
    "/get",
    // isValidAdmin,
    getFolder
)

router.patch(
    "/patch",
    isValidAdmin,
    updateFolder
)

router.patch(
    "/patch/video/status",
    isValidAdmin,
    updateFolderLinkStatus
)

router.delete(
    "/delete",
    isValidAdmin,
    deleteFolder
)

router.patch(
    "/thumbnail",
    isValidAdmin,
    makeThumbnail
)

router.patch(
    "/banner",
    isValidAdmin,
    makeBanner
)
module.exports = router