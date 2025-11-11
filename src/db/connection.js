const mongoose = require('mongoose')

mongoose.set("strictQuery", false);
// MongoDb Connection


mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }
).then(() => {
    console.log("Connected to the DB")
}).catch((err) => {
    console.log(err)
})
