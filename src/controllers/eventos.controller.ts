import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getEventos (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select a.id, a.evento, a.descripcion, a.fecha, a.estatus, a.activo, b.empresa ";
        const from = " from t_eventos a, t_empresas b ";
        const where = " where a.idempresa = b.id order by 1 asc ";
        const resp = await pool.query(sql + from + where);
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);             
        
    }
    catch (e) {
        return res.status(400).send('Error Listando Eventos >>> ' + e);
    }
}
export async function getEventosActivos (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idusuario } = req.body;
        const sql = "select a.id, a.evento, a.descripcion, a.fecha, a.estatus, a.activo, b.empresa, c.numero ";
        const from = " from t_eventos a ";
        let leftjoin = " left join t_empresas b ON a.idempresa = b.id ";
        leftjoin += " left join t_evento_usuario c ON a.id = c.idevento and c.idusuario = $1 ";
        const where = " where a.activo = 1 ";
        const resp = await pool.query(sql + from + leftjoin + where, [idusuario]);
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);             
        
    }
    catch (e) {
        return res.status(400).send('Error Listando Eventos Activos >>> ' + e);
    }
}

export async function setEvento (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idempresa, evento, descripcion, fecha } = req.body;
       
        const insert = "insert into t_eventos (idempresa, evento, descripcion, fecha, estatus, activo) ";
        const values = " values ($1, $2, $3, $4, 1, 0) ";
        let resp = await pool.query(insert + values, [idempresa, evento, descripcion, fecha]);    
        
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
}
export async function getNumero (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idevento, idusuario, fecha } = req.body;
        
        await pool.query('BEGIN')

        const sql = " UPDATE t_eventos ";
        let set = " SET numeroactual = numeroactual + 1 ";
        const where = " where id = $1 RETURNING numeroactual ";
      
        // console.log(sql + set + where);
        const resp = await pool.query(sql + set + where, [idevento]);

        const numero = Number(resp.rows[0].numeroactual)
        
        const insert = "insert into t_evento_usuario (idevento, idusuario, numero, fecha) ";
        const values = " values ($1, $2, $3, $4) ";
        await pool.query(insert + values, [idevento, idusuario, numero, fecha]);    
        
        await pool.query('COMMIT')

        const data = {
            success: true,
            resp: {
                message: "Número de evento tomado coon éxito"
            }
        };
        return res.status(200).json(data);
        
    }
    catch (e) {

        await pool.query('ROLLBACK')
        
        return res.status(400).send('Error Creando Evento >>>>  ' + e);
    }
}

export async function getSiguiente (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idevento } = req.body;

        await pool.query('BEGIN')

        const sql = "select d.id, a.nombre, a.documento, e.abrev, a.correo, a.telefono, b.empresa, c.evento, d.numero ";
        const from = " from t_usuarios a, t_empresas b, t_eventos c, t_evento_usuario d, t_tipodocumentos e ";
        let where = " where a.id = d.idusuario and c.idempresa = b.id and c.id = d.idevento ";
        where += " and e.id=a.iddocumento and d.estatus = 0 and d.idevento = $1";
        const orderlimit = " order by d.numero asc limit 1"
        
        const resp = await pool.query(sql + from + where + orderlimit, [idevento]);
        // console.log(sql + set + where);
        
        if(resp.rows.length > 0) {
            const id = resp.rows[0].id
            const update = " UPDATE t_evento_usuario ";
            let set = " SET estatus = 1 ";
            const whereupd = " where id = $1 ";
            await pool.query(update + set + whereupd, [id]);
        }
        await pool.query('COMMIT')
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);
        
    }
    catch (e) {

        await pool.query('ROLLBACK')
        
        return res.status(400).send('Error Creando Evento >>>>  ' + e);
    }
}

export async function updActivoEvento (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idevento, activo } = req.body;
        
        const sql = " UPDATE t_eventos ";
        let set = " SET activo = $2 ";
        const where = " where id = $1 ";
      
        // console.log(sql + set + where);
        const resp = await pool.query(sql + set + where, [idevento, activo]);

        const data = {
            success: true,
            resp: {
                message: "Evento actualizado con éxito"
            }
        };
        return res.status(200).json(data);
        
    }
    catch (e) {

        await pool.query('ROLLBACK')
        
        return res.status(400).send('Error Creando Evento >>>>  ' + e);
    }
}
