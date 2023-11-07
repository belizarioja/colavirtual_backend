"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restar_controller_1 = require("../controllers/restar.controller");
const router = (0, express_1.Router)();
router.route('/').post(restar_controller_1.setRestar);
exports.default = router;
