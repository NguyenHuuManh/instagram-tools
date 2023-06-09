import { Router } from "express";
import {
  LoginAccount,
  autoPostOnAccount,
  deleteAccount,
  getListAccount,
  getStatusAccount,
  loginWithCookies,
  schedulePost,
} from "../controllers/instagramControler";
import pool from "../connectdb";
pool;
const router = Router();
router.post("/auto-post-on-account", autoPostOnAccount);
router.post("/login-on-account", LoginAccount);
router.get("/list-account", getListAccount);
router.delete("/delete-account/:id", deleteAccount);
router.post("/restore-login-account", loginWithCookies);
router.get("/get-account-status/:id", getStatusAccount);
router.get("/auto-post", schedulePost);
router.post("/test-logging", (req, res, next) => {
  const error = new Error("Something went wrong");
  next(error);
});

export default router;
