import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/golbalErrorHandler";
import router from "./app/routes";
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Pet Adoption API.........",
  });
});

// global error handler
app.use(globalErrorHandler);

export default app;
