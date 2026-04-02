import { Router, Request, Response } from "express";

export const main_router = Router();

main_router.get("/test", async (req: Request, res: Response) => {
  res.status(200).send("hello");
});
