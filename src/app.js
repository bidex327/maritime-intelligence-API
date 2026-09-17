import express from "express";
import cors from "cors"
import vesselRoutes from "./routes/vesselRoute.js"
import aisObservation from "./routes/aisObservationRoutes.js"
import aisAnomalyRoutes from "./routes/aisAnomalyRoutes.js"
import aisSignalGapRoutes from "./routes/aisSignalGapRoutes.js"
import aisHeadingAnomalyRoutes from "./routes/aisHeadingAnomalyRoutes.js"
import aisRouteDeviationRoutes from "./routes/aisRouteDeviationRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/vessels", vesselRoutes)
app.use("/api/ais-observations", aisObservation)
app.use("/api/ais-anomalies", aisAnomalyRoutes)
app.use("/api/ais-anomalies", aisSignalGapRoutes)
app.use("/api/ais-anomalies", aisHeadingAnomalyRoutes)
app.use("/api/ais-anomalies", aisRouteDeviationRoutes)
app.get("/", (req, res) => {
  res.send("Maritime-intelligence API is running");
});

export default app;
