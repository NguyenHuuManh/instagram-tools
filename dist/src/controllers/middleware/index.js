"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.LogRequest = void 0;
const LogRequest = (req, res, next) => {
    const { method, originalUrl, ip, query, body } = req;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${originalUrl} from ${ip}`);
    console.log("Query Parameters:", query);
    console.log("Request Body:", body);
    next();
};
exports.LogRequest = LogRequest;
const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error("Error:", err);
    // Set the response status code
    res.status(500);
    // Return the error message as the response
    res.json({
        error: err.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=index.js.map