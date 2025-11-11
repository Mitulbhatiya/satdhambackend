const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const dotenv = require('dotenv');
dotenv.config();

// DB connection
require('./src/db/connection')

/** Allow form-data from body */
// app.use(bodyParser.urlencoded({ extended: true }))
// /** Allow json data from body */
// app.use(bodyParser.json())

app.use(bodyParser.json({ limit: '5000mb' }));
app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));

app.use(cors());

/** enable cors */
// app.use(cors({
//     origin: ["http://localhost", "https://satsabha.bitbrains.in"],
//     credentials: true,            //access-control-allow-credentials:true
// }));


// console.log("cal")
const loginRoutes = require('./src/routes/login/login.routes')
// Admin
const adminRoutes = require('./src/routes/admin/admin.routes')
// User
const userRoutes = require('./src/routes/user/user.routes')



// Folder
const folderRoutes = require('./src/routes/sat/folder.routes')
// Upload
const uploadRoutes = require('./src/routes/sat/upload.routes')
// Daily Darshan
const ddRoutes = require('./src/routes/sat/dailyDarshan.routes')

// Whatsapp QR
const whqrRoutes = require('./src/routes/sat/whqr.routes')

// Activity Folder
const activityFolderRoutes = require('./src/routes/sat/folderActivity.routes')
// Activity upload
const activityUploadRoutes = require('./src/routes/sat/uploadActivity.routes')

// Seva Folder
const sevaFolderRoutes = require('./src/routes/sat/folderSeva.routes')
// Seva upload
const sevaUploadRoutes = require('./src/routes/sat/uploadSeva.routes')

// Youtube
const youtubeRoutes = require('./src/routes/sat/youtube.routes')
// Gaushala
const gaushalaRoutes = require('./src/routes/sat/gaushala.routes')
// Sanskar
const sanskarRoutes = require('./src/routes/sat/sanskar.routes')
// Yagna Mandir
const yagnaRoutes = require('./src/routes/sat/yagna.routes')
// Seva Mandir
const sevaRoutes = require('./src/routes/sat/seva.routes')
// Youtube Thumbnail for Sanskar, Gau, Yagn
const ytThumRoutes = require('./src/routes/sat/youutubeLinkThumb.routes')
// Contact us SAT
const contactUsSatRoutes = require('./src/routes/sat/contactusSAT.routes')
// Youtube Link for Upload section
const youtubeUploadLinkRoutes = require('./src/routes/sat/youtubeUploadLink.routes')
// Sant mandal
const santMandalRoutes = require('./src/routes/sat/santmandal.routes')



// ============================ SAT SHRI ====================================
const satshriUserRoute = require('./src/routes/satshri/users.routes')
const donetionRoute = require('./src/routes/satshri/donetion.routes')
// ==========================================================================

app.use("/login", loginRoutes)
app.use("/admin", adminRoutes)
app.use("/user", userRoutes)

// Vicharan
app.use("/folder", folderRoutes)
app.use("/upload", uploadRoutes)

// Activity
app.use("/activityfolder", activityFolderRoutes)
app.use("/activityupload", activityUploadRoutes)

// Youtube Upload Link - 
app.use("/youtubeuploadlink", youtubeUploadLinkRoutes)
// Youtube Upload Link - 
app.use("/santmandal", santMandalRoutes)

// seva
app.use("/sevafolder", sevaFolderRoutes)
app.use("/sevaupload", sevaUploadRoutes)

app.use("/dd", ddRoutes)
app.use("/whqr", whqrRoutes)


app.use("/gaushala", gaushalaRoutes)
app.use("/sanskar", sanskarRoutes)
app.use("/yagna", yagnaRoutes)
app.use("/seva", sevaRoutes)
app.use("/ytthumb", ytThumRoutes)


app.use("/youtube", youtubeRoutes)
app.use("/contactus", contactUsSatRoutes)


// ============== SAT SHRI =================
app.use("/satshri/user", satshriUserRoute)
app.use("/satshri/donetion", donetionRoute)
// =========================================


// GET VERSION
const appVersion = "2.0.0";
app.get("/version", (req, res) => {
    res.json({ version: appVersion });
});

module.exports = app;