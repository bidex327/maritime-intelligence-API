import Rule from "../models/ruleModel.js";

const createRule = async (ruleData) => {
  const rule = await Rule.create(ruleData);

  return rule;
};

const getAllRules = async () => {
  const rules = await Rule.find().sort({ createdAt: -1 });

  return rules;
};

const getRuleById = async (id) => {
  const rule = await Rule.findById(id);

  return rule;
};

const getEnabledRules = async () => {
  const rules = await Rule.find({ enabled: true }).sort({
    createdAt: -1,
  });

  return rules;
};

export {
  createRule,
  getAllRules,
  getRuleById,
  getEnabledRules,
};