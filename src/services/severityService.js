const calculateSeverity = (rule) => {
  if (!rule || !rule.severity) {
    return {
      severity: "low",
      reason: "No rule severity provided",
    };
  }

  return {
    severity: rule.severity,
    reason: `Severity inherited from rule: ${rule.code}`,
  };
};

export { calculateSeverity };