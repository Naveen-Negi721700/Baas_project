import 'dotenv/config'
import app from "./app.js";
import connectDb from "./db/index.js";
const port=process.env.PORT

app.get('/',(req,res)=>{
    res.send("express")
})
connectDb()
.then(()=>{

    app.listen(port | 3000 ,()=>{
         console.log(`Example app listening on port ${port}`)
        
    })
})

