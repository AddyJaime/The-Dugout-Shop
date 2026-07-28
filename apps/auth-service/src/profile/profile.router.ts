import { Router } from "express";
import {
  createProfileHandler,
  getProfileHandler,
  updateProfileHandler,
} from "./profile.controller";
import authenticateToken from "../middleware/auth.middleware";

const profileRouter: Router = Router();

profileRouter.get("/", authenticateToken, getProfileHandler);

profileRouter.put("/", authenticateToken, updateProfileHandler);

profileRouter.post("/", createProfileHandler);

export default profileRouter;
