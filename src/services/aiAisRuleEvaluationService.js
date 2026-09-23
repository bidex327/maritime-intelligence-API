import Rule from "../models/ruleModel.js";

const evaluateAiAisCorrelationRule = async (correlationData) => {
  const rule = await Rule.findOne({
    code: "AI_AIS_CORRELATION",
    enabled: true,
  });

  if (!rule) {
    return {
      triggered: false,
      message: "AI-AIS correlation rule is not enabled",
      rule: null,
    };
  }

  const matchScore = correlationData.matchScore;
  const minimumMatchScore = rule.conditions.minimumMatchScore;

  const triggered = matchScore >= minimumMatchScore;

  return {
    triggered,
    message: triggered
      ? "AI-AIS correlation rule triggered"
      : "AI-AIS correlation rule not triggered",
    rule: {
      id: rule._id,
      code: rule.code,
      name: rule.name,
      severity: rule.severity,
    },
    evidence: {
      anomalyType: "ai_ais_correlation",
      matchScore,
      minimumMatchScore,
    },
  };
};

export { evaluateAiAisCorrelationRule };