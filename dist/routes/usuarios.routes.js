"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_controller_1 = require("../controllers/usuarios.controller");
const router = (0, express_1.Router)();
router.route('/').get(usuarios_controller_1.getUsuarios);
router.route('/roles').get(usuarios_controller_1.getRoles);
router.route('/tipos').get(usuarios_controller_1.getTipoDocumentos);
router.route('/login').post(usuarios_controller_1.getLogin);
router.route('/crear').post(usuarios_controller_1.setUsuario);
exports.default = router;
