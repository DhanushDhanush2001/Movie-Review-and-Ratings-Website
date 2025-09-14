const bcrypt=require("bcrypt")


const hashPassword=async(password)=>{
    console.log("🔑 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("✅ Password hashed successfully.");
    return hashedPassword
}


const comparePassword = async (userEnteredPassword, databasePassword) => {
    return await bcrypt.compare(userEnteredPassword, databasePassword);};


module.exports={hashPassword,
    comparePassword
}