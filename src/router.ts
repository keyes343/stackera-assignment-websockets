import { Router, Request, Response } from "express";
import * as ctrl from "@controllers/index";
// import { auth_check } from "@src/middlewares";

export const router = Router();
router.use("/price", ctrl.price_router);
