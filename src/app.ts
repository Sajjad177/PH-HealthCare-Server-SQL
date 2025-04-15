import cors from "cors";
import express, { Application } from "express";
import { userRouter } from "./Modules/user/user.routes";

const app: Application = express();
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hay! Server is running");
});

export default app;
