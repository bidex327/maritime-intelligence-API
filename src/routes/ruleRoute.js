import express from "express";

import {
  createRuleController,
  getAllRulesController,
  getRuleByIdController,
  getEnabledRulesController,
} from "../controllers/ruleController.js";

const router = express.Router();

router.post("/", createRuleController);

router.get("/", getAllRulesController);

router.get("/enabled", getEnabledRulesController);

router.get("/:id", getRuleByIdController);

export default router;