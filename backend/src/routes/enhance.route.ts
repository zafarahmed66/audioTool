import { Router } from "express";
import multer from "multer";
import { enhance } from "../controllers/enhance.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/enhance', upload.single('file'),  enhance);

export default router;