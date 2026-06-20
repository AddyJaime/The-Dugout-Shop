import dotenv from "dotenv";
dotenv.config();
import express, { Response, Request } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Express + TypeScript server is running!" });
});

app.listen(PORT, () => {
  console.log(
    `[server]: running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
