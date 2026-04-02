import { Request, Response } from "express";
import "module-alias/register";
import { router } from "./router";
import { app } from "./app";
// import { connect } from "./mongoose";
import "dotenv/config";
// import serverless from "serverless-http";
// import { redisClient } from "./config/redis";

const port = 5000;
// const mode = process.env.MODE || "dev";
// const finalPort = mode === "prod" ? port : "5001";

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server running");
});
app.use(router);

console.log("ran 1");

app.listen(5000, async () => {
  // await connect();
  // await redisClient.set("foo", "bar");
  // const result = await redisClient.get("foo");
  // console.log(result);
  console.log("hi there");
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export const handler = app;
// export const handler = serverless(app);
