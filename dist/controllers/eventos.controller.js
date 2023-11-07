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
exports.updActivoEvento = exports.getSiguiente = exports.getNumero = exports.setEvento = exports.getEventosActivos = exports.getEventos = void 0;
// DB
const database_1 = require("../database");
function getEventos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select a.id, a.evento, a.descripcion, a.fecha, a.estatus, a.activo, b.empresa ";
            const from = " from t_eventos a, t_empresas b ";
            const where = " where a.idempresa = b.id order by 1 asc ";
            const resp = yield database_1.pool.query(sql + from + where);
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Eventos >>> ' + e);
        }
    });
}
exports.getEventos = getEventos;
function getEventosActivos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idusuario } = req.body;
            const sql = "select a.id, a.evento, a.descripcion, a.fecha, a.estatus, a.activo, b.empresa, c.numero ";
            const from = " from t_eventos a ";
            let leftjoin = " left join t_empresas b ON a.idempresa = b.id ";
            leftjoin += " left join t_evento_usuario c ON a.id = c.idevento and c.idusuario = $1 ";
            const where = " where a.activo = 1 ";
            const resp = yield database_1.pool.query(sql + from + leftjoin + where, [idusuario]);
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Eventos Activos >>> ' + e);
        }
    });
}
exports.getEventosActivos = getEventosActivos;
function setEvento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idempresa, evento, descripcion, fecha } = req.body;
            const insert = "insert into t_eventos (idempresa, evento, descripcion, fecha, estatus, activo) ";
            const values = " values ($1, $2, $3, $4, 1, 0) ";
            let resp = yield database_1.pool.query(insert + values, [idempresa, evento, descripcion, fecha]);
            const data = {
                success: true,
                resp: {
                    message: "Evento creado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Creando Evento >>>>  ' + e);
        }
    });
}
exports.setEvento = setEvento;
function getNumero(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idevento, idusuario, fecha } = req.body;
            yield database_1.pool.query('BEGIN');
            const sql = " UPDATE t_eventos ";
            let set = " SET numeroactual = numeroactual + 1 ";
            const where = " where id = $1 RETURNING numeroactual ";
            // console.log(sql + set + where);
            const resp = yield database_1.pool.query(sql + set + where, [idevento]);
            const numero = Number(resp.rows[0].numeroactual);
            const insert = "insert into t_evento_usuario (idevento, idusuario, numero, fecha) ";
            const values = " values ($1, $2, $3, $4) ";
            yield database_1.pool.query(insert + values, [idevento, idusuario, numero, fecha]);
            yield database_1.pool.query('COMMIT');
            const data = {
                success: true,
                resp: {
                    message: "Número de evento tomado coon éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            yield database_1.pool.query('ROLLBACK');
            return res.status(400).send('Error Creando Evento >>>>  ' + e);
        }
    });
}
exports.getNumero = getNumero;
function getSiguiente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idevento } = req.body;
            yield database_1.pool.query('BEGIN');
            const sql = "select d.id, a.nombre, a.documento, e.abrev, a.correo, a.telefono, b.empresa, c.evento, d.numero ";
            const from = " from t_usuarios a, t_empresas b, t_eventos c, t_evento_usuario d, t_tipodocumentos e ";
            let where = " where a.id = d.idusuario and c.idempresa = b.id and c.id = d.idevento ";
            where += " and e.id=a.iddocumento and d.estatus = 0 and d.idevento = $1";
            const orderlimit = " order by d.numero asc limit 1";
            const resp = yield database_1.pool.query(sql + from + where + orderlimit, [idevento]);
            // console.log(sql + set + where);
            if (resp.rows.length > 0) {
                const id = resp.rows[0].id;
                const update = " UPDATE t_evento_usuario ";
                let set = " SET estatus = 1 ";
                const whereupd = " where id = $1 ";
                yield database_1.pool.query(update + set + whereupd, [id]);
            }
            yield database_1.pool.query('COMMIT');
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            yield database_1.pool.query('ROLLBACK');
            return res.status(400).send('Error Creando Evento >>>>  ' + e);
        }
    });
}
exports.getSiguiente = getSiguiente;
function updActivoEvento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idevento, activo } = req.body;
            const sql = " UPDATE t_eventos ";
            let set = " SET activo = $2 ";
            const where = " where id = $1 ";
            // console.log(sql + set + where);
            const resp = yield database_1.pool.query(sql + set + where, [idevento, activo]);
            const data = {
                success: true,
                resp: {
                    message: "Evento actualizado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            yield database_1.pool.query('ROLLBACK');
            return res.status(400).send('Error Creando Evento >>>>  ' + e);
        }
    });
}
exports.updActivoEvento = updActivoEvento;
