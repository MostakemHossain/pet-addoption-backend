import cors from "cors";
import express, { Application, Request, Response } from "express";
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Pet Adoption API.........",
  });
});

export default app;
