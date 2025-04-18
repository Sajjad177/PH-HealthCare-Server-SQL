import cors from "cors";
import express, { Application } from "express";
import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

// global error handler
app.use(globalErrorHandler);

// handle api not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "Your request url is not correct",
      },
    ],
  });
  next();
});

app.get("/", (req, res) => {
  res.send("Hay! Server is running");
});

export default app;
