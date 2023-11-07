import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getEmpresas (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select * from t_empresas ";
        console.log(sql);
        const resp = await pool.query(sql);
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
}

export async function setEmpresa (req: Request, res: Response): Promise<Response | void> {
    try {
        const { empresa, correo, telefono } = req.body;
       
        const insert = "insert into t_empresas (empresa, correo, telefono) ";
        const values = " values ($1, $2, $3) ";
        let resp = await pool.query(insert + values, [empresa, correo, telefono]);    
        
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
}
