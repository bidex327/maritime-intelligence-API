import {
  createRule,
  getAllRules,
  getRuleById,
  getEnabledRules,
} from "../services/ruleService.js";

const createRuleController = async (req, res) => {
  try {
    const rule = await createRule(req.body);

    return res.status(201).json({
      message: "Rule created successfully",
      data: rule,
    });
  } catch (error) {
    console.error("Rule creation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid rule data",
        errors: Object.values(error.errors).map(
          (validationError) => validationError.message
        ),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A rule with this code already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create rule",
    });
  }
};

const getAllRulesController = async (req, res) => {
  try {
    const rules = await getAllRules();

    return res.status(200).json({
      message: "Rules retrieved successfully",
      count: rules.length,
      data: rules,
    });
  } catch (error) {
    console.error("Rule retrieval error:", error);

    return res.status(500).json({
      message: "Failed to retrieve rules",
    });
  }
};

const getRuleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Rule ID is required",
      });
    }

    const rule = await getRuleById(id);

    if (!rule) {
      return res.status(404).json({
        message: "Rule not found",
      });
    }

    return res.status(200).json({
      message: "Rule retrieved successfully",
      data: rule,
    });
  } catch (error) {
    console.error("Rule retrieval by ID error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid rule ID",
      });
    }

    return res.status(500).json({
      message: "Failed to retrieve rule",
    });
  }
};

const getEnabledRulesController = async (req, res) => {
  try {
    const rules = await getEnabledRules();

    return res.status(200).json({
      message: "Enabled rules retrieved successfully",
      count: rules.length,
      data: rules,
    });
  } catch (error) {
    console.error("Enabled rule retrieval error:", error);

    return res.status(500).json({
      message: "Failed to retrieve enabled rules",
    });
  }
};

export {
  createRuleController,
  getAllRulesController,
  getRuleByIdController,
  getEnabledRulesController,
};