import AiAisCorrelation from "../models/aiAisCorrelationModel.js";
import Incident from "../models/incidentModel.js";

import { evaluateAiAisCorrelationRule } from "./aiAisRuleEvaluationService.js";
import { calculateSeverity } from "./severityService.js";
import { generateAlertFromIncident } from "./alertGenerationService.js";

const generateIncidentFromAiAisCorrelation = async (correlationId) => {
  try {
    // 1. Find the AI-AIS correlation
    const correlation = await AiAisCorrelation.findById(correlationId);

    if (!correlation) {
      return {
        created: false,
        message: "AI-AIS correlation not found",
        data: null,
      };
    }

    // 2. Prevent duplicate incidents for the same correlation
    const existingIncident = await Incident.findOne({
      "evidence.correlationId": correlation._id,
    });

    if (existingIncident) {
      return {
        created: false,
        message: "Incident already exists for this AI-AIS correlation",
        data: existingIncident,
      };
    }

    // 3. Evaluate the configured AI-AIS rule
    const ruleResult = await evaluateAiAisCorrelationRule({
      matchScore: correlation.matchScore,
    });

    if (!ruleResult.triggered) {
      return {
        created: false,
        message: "AI-AIS correlation rule was not triggered",
        data: ruleResult,
      };
    }

    // 4. Calculate incident severity from the rule
    const severityResult = calculateSeverity(ruleResult.rule);

    // 5. Create the incident
    const incident = await Incident.create({
      title: "AI-AIS Correlation Detected",
      description:
        "An AI detection strongly correlated with an AIS-tracked vessel based on spatial and temporal proximity.",
      severity: severityResult.severity,
      rule: ruleResult.rule.id,
      aiDetection: correlation.aiDetection,
      vessel: correlation.vessel,
      aisObservation: correlation.aisObservation,
      evidence: {
        anomalyType: "ai_ais_correlation",
        correlationId: correlation._id,
        distanceMeters: correlation.distanceMeters,
        timeDifferenceSeconds: correlation.timeDifferenceSeconds,
        matchScore: correlation.matchScore,
        correlationStatus: correlation.status,
        correlatedAt: correlation.correlatedAt,
      },
      detectedAt: correlation.correlatedAt,
    });

    // 6. Generate an alert for the incident
    const alertResult = await generateAlertFromIncident(incident._id);

    return {
      created: true,
      message: "AI-AIS incident and alert generated successfully",
      data: {
        incident,
        alert: alertResult,
      },
    };
  } catch (error) {
    if (error.name === "CastError") {
      return {
        created: false,
        message: "Invalid AI-AIS correlation ID",
        data: null,
      };
    }

    throw error;
  }
};

export { generateIncidentFromAiAisCorrelation };