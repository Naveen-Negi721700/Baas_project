import 'dotenv/config'
import app from "./app.js";
import connectDb from "./db/index.js";
const port = process.env.PORT

app.get('/', (req, res) => {
    res.send("express")
})

connectDb()
.then(() => {
    app.listen(port || 3000, () => {
        console.log(`Example app listening on port ${port || 3000}`)
    })
})
.catch((error) => {
    // shows why the database did not connect, for example a wrong address or a blocked IP
    console.error("MongoDB connection failed:", error.message)
})