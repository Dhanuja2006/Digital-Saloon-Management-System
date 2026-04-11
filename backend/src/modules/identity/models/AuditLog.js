import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        action: {
            type: String,
            required: true, // e.g., "LOGIN_ATTEMPT", "PASSWORD_RESET", "LOGOUT"
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILURE"],
            required: true,
        },
        ipAddress: String,
        userAgent: String,
        details: Object,
    },
    {
        timestamps: true,
    }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
