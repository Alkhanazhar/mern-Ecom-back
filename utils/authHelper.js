const bcrypt = require("bcrypt");

module.exports.hashPassword =(password)=>{
    try {
        const salt=10
        const hashedPassword =bcrypt.hash(password, salt)
        return hashedPassword
    } catch (error) {
        console.log("cannot hash password")
        res.status(404).send(error.message) 
}
}
module.exports.comparePassword =async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}
