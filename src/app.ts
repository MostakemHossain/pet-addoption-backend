import cors from "cors";
import express, { Application, Request, Response } from "express";
import { userRoutes } from "./app/modules/user/user.routes";
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());


app.use("/api/v1",userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Pet Adoption API.........",
  });
});

export default app;
