import { Router } from "express";
import {
  generateNewSong,
  getSong,
  getRecentSongs,
} from "../controllers/song.controller";

const router = Router();

// Song generation and management routes
router.post("/generate", generateNewSong);
router.get("/:id", getSong);
router.get("/recent", getRecentSongs);

export default router;
