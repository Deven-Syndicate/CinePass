import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

export default app;