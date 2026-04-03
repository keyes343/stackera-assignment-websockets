import { latestPrices } from "@src/helperFunctions";
import { Router, Request, Response } from "express";

export const price_router = Router();

price_router.get("/", async (req: Request, res: Response) => {
  res.status(200).json(latestPrices);
});
