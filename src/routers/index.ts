import { Router } from "express";
import { autoPostOnAccount } from "../controllers/instagramControler";

const router = Router();
router.post("/auto-post-on-account", autoPostOnAccount);

export default router;
