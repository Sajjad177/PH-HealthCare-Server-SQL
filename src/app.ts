import cors from "cors";
import express, { Application } from "express";
import { userRouter } from "./Modules/user/user.routes";
import { adminRouter } from "./Modules/admin/admin.routes";

const app: Application = express();
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Hay! Server is running");
});

export default app;
