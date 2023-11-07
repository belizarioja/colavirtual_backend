"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEmpresa = exports.getEmpresas = void 0;
// DB
const database_1 = require("../database");
function getEmpresas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select * from t_empresas ";
            console.log(sql);
            const resp = yield database_1.pool.query(sql);
            const cant = resp.rows.length;
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Empresas ' + e);
        }
    });
}
exports.getEmpresas = getEmpresas;
function setEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { empresa, correo, telefono } = req.body;
            const insert = "insert into t_empresas (empresa, correo, telefono) ";
            const values = " values ($1, $2, $3) ";
            let resp = yield database_1.pool.query(insert + values, [empresa, correo, telefono]);
            const data = {
                success: true,
                resp: {
                    message: "Empresa creado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Creando Empresa ' + e);
        }
    });
}
exports.setEmpresa = setEmpresa;
