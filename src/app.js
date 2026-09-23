import express from "express";
import cors from "cors";
import vesselRoutes from "./routes/vesselRoute.js";
import aisObservation from "./routes/aisObservationRoutes.js";
import aisAnomalyRoutes from "./routes/aisAnomalyRoutes.js";
import aisSignalGapRoutes from "./routes/aisSignalGapRoutes.js";
import aisHeadingAnomalyRoutes from "./routes/aisHeadingAnomalyRoutes.js";
import aisRouteDeviationRoutes from "./routes/aisRouteDeviationRoutes.js";
import aisAnomalySummaryRoutes from "./routes/aisAnomalySummaryRoutes.js";
import aisDetectionRoutes from "./routes/aiDetectionRoutes.js";
import aiAisCorrelationRoutes from "./routes/aiAisCorrelationRoutes.js";
import ruleRoutes from "./routes/ruleRoute.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import alertRoutes from "./routes/alertRoutes.js"


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/vessels", vesselRoutes);
app.use("/api/ais-observations", aisObservation);
app.use("/api/ais-anomalies", aisAnomalyRoutes);
app.use("/api/ais-anomalies", aisSignalGapRoutes);
app.use("/api/ais-anomalies", aisHeadingAnomalyRoutes);
app.use("/api/ais-anomalies", aisRouteDeviationRoutes);
app.use("/api/ais-anomalies", aisAnomalySummaryRoutes);
app.use("/api/ai-detections", aisDetectionRoutes);
app.use("/api/ai-ais-correlations", aiAisCorrelationRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/alerts", alertRoutes)
app.get("/", (req, res) => {
  res.send("Maritime-intelligence API is running");
});

export default app;