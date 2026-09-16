import express from "express";
import cors from "cors"
import vesselRoutes from "./routes/vesselRoute.js"
import aisObservation from "./routes/aisObservationRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/vessels", vesselRoutes)
app.use("/api/ais-observations", aisObservation)
app.get("/", (req, res) => {
  res.send("Maritime-intelligence API is running");
});

export default app;
