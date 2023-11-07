import { Request, Response } from 'express';
// import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || '123456';
// DB
import { pool } from '../database'

export async function getUsuarios (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select a.id, a.usuario, a.clave, a.correo, a.telefono, a.direccion, a.nombre, a.idrol, b.rol ";
        const from = " from t_usuarios a, t_roles b ";
        const where = " where a.idrol = b.id ";
        const resp = await pool.query(sql + from + where);
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);

    }
    catch (e) {
        return res.status(400).send('Error Listando usuarios ' + e);
    }
}

export async function getRoles (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select id, rol ";
        const from = " from t_roles ";
        const resp = await pool.query(sql + from);
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);

    }
    catch (e) {
        return res.status(400).send('Error Listando roles ' + e);
    }
}
export async function getTipoDocumentos (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select id, tipodocumento, abrev ";
        const from = " from t_tipodocumentos ";
        const resp = await pool.query(sql + from);
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);

    }
    catch (e) {
        return res.status(400).send('Error Listando tipos documentos ' + e);
    }
}

export async function getLogin (req: Request, res: Response): Promise<Response | void> {
    try {
        const { usuario, clave } = req.body;
        const sql = "select a.id, a.nombre, a.idrol, b.rol ";
        const from = " from t_usuarios a, t_roles b ";
        const where = " where a.idrol = b.id and a.usuario ='" + usuario + "' and a.clave = '" + clave + "'";
        console.log(sql + from + where);
        const resp = await pool.query(sql + from + where);
        console.log(resp.rows[0])
        const cant = resp.rows.length;
        if (cant > 0) {
               
            const accessToken: string = jwt.sign({ user: resp.rows[0] }, SECRET);
            const data = {
                message: "Acceso válido",
                resp: resp.rows[0],
                accessToken: accessToken
            };
            return res.status(200).json(data);            
            
        } else {
            const data = {
                message: "Credenciales Incorrectas!"
            };
            return res.status(202).json(data);
        }
    }
    catch (e) {
        return res.status(400).send('Error Logueando ' + e);
    }
}

export async function setUsuario (req: Request, res: Response): Promise<Response | void> {
    try {
        const { usuario, clave, nombre, idrol, correo, telefono, direccion, iddocumento, documento } = req.body;
       
        const insert = "insert into t_usuarios (usuario, clave, nombre, idrol, correo, telefono, direccion, iddocumento, documento) ";
        const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9) ";
        let resp = await pool.query(insert + values, [usuario, clave, nombre, idrol, correo, telefono, direccion, iddocumento, documento]);    
        
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
}