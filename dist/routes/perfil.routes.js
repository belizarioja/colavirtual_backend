"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const perfil_controller_1 = require("../controllers/perfil.controller");
const router = (0, express_1.Router)();
router.route('/').post(perfil_controller_1.getPerfil);
exports.default = router;
