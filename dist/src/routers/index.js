"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const instagramControler_1 = require("../controllers/instagramControler");
const connectdb_1 = __importDefault(require("../connectdb"));
connectdb_1.default;
const router = (0, express_1.Router)();
router.post("/auto-post-on-account", instagramControler_1.autoPostOnAccount);
router.post("/login-on-account", instagramControler_1.LoginAccount);
router.get("/list-account", instagramControler_1.getListAccount);
router.delete("/delete-account/:id", instagramControler_1.deleteAccount);
router.post("/restore-login-account", instagramControler_1.loginWithCookies);
router.get("/get-account-status/:id", instagramControler_1.getStatusAccount);
router.get("/auto-post", instagramControler_1.schedulePost);
router.post("/test-logging", (req, res, next) => {
    const error = new Error("Something went wrong");
    next(error);
});
exports.default = router;
//# sourceMappingURL=index.js.map