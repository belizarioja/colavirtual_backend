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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUsuario = exports.getLogin = exports.getTipoDocumentos = exports.getRoles = exports.getUsuarios = void 0;
// import crypto from 'crypto';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.SECRET || '123456';
// DB
const database_1 = require("../database");
function getUsuarios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select a.id, a.usuario, a.clave, a.correo, a.telefono, a.direccion, a.nombre, a.idrol, b.rol ";
            const from = " from t_usuarios a, t_roles b ";
            const where = " where a.idrol = b.id ";
            const resp = yield database_1.pool.query(sql + from + where);
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando usuarios ' + e);
        }
    });
}
exports.getUsuarios = getUsuarios;
function getRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select id, rol ";
            const from = " from t_roles ";
            const resp = yield database_1.pool.query(sql + from);
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando roles ' + e);
        }
    });
}
exports.getRoles = getRoles;
function getTipoDocumentos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select id, tipodocumento, abrev ";
            const from = " from t_tipodocumentos ";
            const resp = yield database_1.pool.query(sql + from);
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando tipos documentos ' + e);
        }
    });
}
exports.getTipoDocumentos = getTipoDocumentos;
function getLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { usuario, clave } = req.body;
            const sql = "select a.id, a.nombre, a.idrol, b.rol ";
            const from = " from t_usuarios a, t_roles b ";
            const where = " where a.idrol = b.id and a.usuario ='" + usuario + "' and a.clave = '" + clave + "'";
            console.log(sql + from + where);
            const resp = yield database_1.pool.query(sql + from + where);
            console.log(resp.rows[0]);
            const cant = resp.rows.length;
            if (cant > 0) {
                const accessToken = jsonwebtoken_1.default.sign({ user: resp.rows[0] }, SECRET);
                const data = {
                    message: "Acceso válido",
                    resp: resp.rows[0],
                    accessToken: accessToken
                };
                return res.status(200).json(data);
            }
            else {
                const data = {
                    message: "Credenciales Incorrectas!"
                };
                return res.status(202).json(data);
            }
        }
        catch (e) {
            return res.status(400).send('Error Logueando ' + e);
        }
    });
}
exports.getLogin = getLogin;
function setUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { usuario, clave, nombre, idrol, correo, telefono, direccion, iddocumento, documento } = req.body;
            const insert = "insert into t_usuarios (usuario, clave, nombre, idrol, correo, telefono, direccion, iddocumento, documento) ";
            const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9) ";
            let resp = yield database_1.pool.query(insert + values, [usuario, clave, nombre, idrol, correo, telefono, direccion, iddocumento, documento]);
            const data = {
                success: true,
                resp: {
                    message: "Usuario creado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Creando Usuario >>>>  ' + e);
        }
    });
}
exports.setUsuario = setUsuario;
