import { Router } from "express";
import {
  LoginAccount,
  autoPostOnAccount,
  deleteAccount,
  getListAccount,
} from "../controllers/instagramControler";
import pool from "../connectdb";
pool;
const router = Router();
//body api http://localhost:8888/auto-post-on-account
// const body = {
//   password: "123aA@123",
//   username: "HaDN123aA",
//   caption: "Test caption",
// };
router.post("/auto-post-on-account", autoPostOnAccount);
router.post("/login-on-account", LoginAccount);
router.get("/list-account", getListAccount);
router.delete("/delete-account/:id", deleteAccount);
router.post("/test-logging", (req, res, next) => {
  const error = new Error("Something went wrong");
  next(error);
});

export default router;
