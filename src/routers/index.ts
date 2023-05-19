import { Router } from "express";
import { autoPostOnAccount } from "../controllers/instagramControler";

const router = Router();
//body api http://localhost:8888/auto-post-on-account
// const body = {
//   password: "123aA@123",
//   username: "HaDN123aA",
//   caption: "Test caption",
// };
router.post("/auto-post-on-account", autoPostOnAccount);

export default router;
