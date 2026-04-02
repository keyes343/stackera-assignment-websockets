import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./router";
import morgan from "morgan";

dotenv.config();

export const app: Express = express();

const allowedOrigins = ["http://localhost:3000"];

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  }),
);
app.set("trust proxy", 1);
// block - end

app.use(morgan("tiny"));
app.get("/test", (req, res) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  res.status(200).send({
    msg: `Hello World 3 - ip - ${ipAddress}`,
  });
});

app.use("/", router);
