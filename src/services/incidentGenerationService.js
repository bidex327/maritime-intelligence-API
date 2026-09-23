import { detectSignalGap } from "./aisSignalGapService.js";
import { evaluateSignalGapRule } from "./ruleEvaluationService.js";
import { calculateSeverity } from "./severityService.js";
import { createIncident } from "./incidentService.js";
import AisObservation from "../models/aisObservationModel.js";
import { generateAlertFromIncident } from "./alertGenerationService.js";

const generateIncidentFromSignalGap = async (vesselId) => {
  // 1. Detect AIS signal gap
  const signalGapResult = await detectSignalGap(vesselId);

  if (!signalGapResult.detected) {
    return {
      created: false,
      message: "No incident generated",
      data: signalGapResult,
    };
  }

  // 2. Convert gap from minutes to seconds
  const signalGapData = {
    gapSeconds: signalGapResult.data.gapInMinutes * 60,
  };

  // 3. Evaluate the configured rule
  const ruleResult = await evaluateSignalGapRule(signalGapData);

  if (!ruleResult.triggered) {
    return {
      created: false,
      message: "Rule was not triggered",
      data: ruleResult,
    };
  }

  // 4. Calculate severity from the rule
  const severityResult = calculateSeverity(ruleResult.rule);

  // 5. Get the latest AIS observation
  const latestObservation = await AisObservation.findOne({
    vessel: vesselId,
  }).sort({ observedAt: -1 });

  // 6. Create the incident
  const incident = await createIncident({
    title: "AIS Signal Gap Detected",
    description:
      "A vessel experienced an AIS signal gap longer than the configured threshold.",
    severity: severityResult.severity,
    rule: ruleResult.rule.id,
    vessel: vesselId,
    aisObservation: latestObservation?._id,
    evidence: {
      anomalyType: "signal_gap",
      gapInMinutes: signalGapResult.data.gapInMinutes,
      gapInSeconds: signalGapData.gapSeconds,
      thresholdSeconds: ruleResult.evidence.thresholdSeconds,
      previousObservedAt: signalGapResult.data.previousObservedAt,
      latestObservedAt: signalGapResult.data.latestObservedAt,
    },
    detectedAt: signalGapResult.data.latestObservedAt,
  });
  const alertResult = await generateAlertFromIncident(incident._id);

return {
  created: true,
  message: "Incident and alert generated successfully",
  data: {
    incident,
    alert: alertResult,
  },
};
};

export { generateIncidentFromSignalGap };