"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresas_controller_1 = require("../controllers/empresas.controller");
const router = (0, express_1.Router)();
router.route('/')
    .get(empresas_controller_1.getEmpresas);
router.route('/')
    .post(empresas_controller_1.setEmpresa);
exports.default = router;
