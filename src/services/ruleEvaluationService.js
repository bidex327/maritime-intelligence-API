import Rule from "../models/ruleModel.js";

const evaluateSignalGapRule = async (signalGapData) => {
  const rule = await Rule.findOne({
    code: "AIS_SIGNAL_GAP",
    enabled: true,
  });

  if (!rule) {
    return {
      triggered: false,
      message: "AIS signal gap rule is not enabled",
      rule: null,
    };
  }

  const gapSeconds = signalGapData.gapSeconds;
  const thresholdSeconds = rule.conditions.thresholdSeconds;

  const triggered = gapSeconds > thresholdSeconds;

  return {
    triggered,
    message: triggered
      ? "AIS signal gap rule triggered"
      : "AIS signal gap rule not triggered",
    rule: {
      id: rule._id,
      code: rule.code,
      name: rule.name,
      severity: rule.severity,
    },
    evidence: {
      anomalyType: "signal_gap",
      gapSeconds,
      thresholdSeconds,
    },
  };
};

export { evaluateSignalGapRule };