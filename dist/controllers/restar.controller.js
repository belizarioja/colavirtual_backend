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
exports.setRestar = void 0;
// DB
const database_1 = require("../database");
function setRestar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { totalmontojugado, usuarioid } = req.body;
            const sql = "select saldo  ";
            const from = " from t_usuarios ";
            const where = " where id = $1 ";
            console.log(sql + from + where);
            const resp = yield database_1.pool.query(sql + from + where, [usuarioid]);
            console.log(resp.rows[0]);
            const saldoactual = resp.rows[0].saldo;
            if (saldoactual >= totalmontojugado) {
                const newsaldo = saldoactual - totalmontojugado;
                const upd = "update t_usuarios ";
                const set = "set saldo = $1 ";
                const where2 = " where id = $2 ";
                const resp2 = yield database_1.pool.query(upd + set + where2, [newsaldo, usuarioid]);
                const data = {
                    success: true,
                    message: 'Enhorabuena! Jugada realizada con éxito'
                };
                return res.status(200).json(data);
            }
            else {
                const data = {
                    success: false,
                    message: 'Oops! Saldo insuciciente.'
                };
                return res.status(201).json(data);
            }
        }
        catch (e) {
            return res.status(400).send('Error Restando Saldo >>> ' + e);
        }
    });
}
exports.setRestar = setRestar;
