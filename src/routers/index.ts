import { Router } from "express";
import multer from "multer";
import {
  autoPostOnAccount,
  loginIstagram,
  postContent,
} from "../controllers/instagramControler";

const router = Router();
var upload = multer({ dest: "./upload/" });

router.post("/login-instagram", loginIstagram);

router.post("/post-content", upload.single("file"), postContent);

router.post("/auto-post-on-account", autoPostOnAccount);

export default router;
