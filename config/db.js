const mongoose = require('mongoose')    

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log("mongodb connection succesfully")
        })
    } catch (error) {
        console.log("mongo is not connected",error.message.bgMagenta)
    }
   
}
module.exports = connectDB