const fieldsValidation = (fields = []) => {
    return (req, res, next) => {
        console.log("🔍 Validating user data...");

        const missingFields = fields.filter(f => !req.body[f] || req.body[f].toString().trim() === "");
        if (missingFields.length) {
            console.log(`❌ Validation failed: ${missingFields.join(", ")} required.`);
            return res.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
        }

        console.log("✅ Validation successful. Proceeding to next Controller...");
        next();
    };
};

module.exports = { fieldsValidation };
