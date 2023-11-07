import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
// const multer = require("multer");

import IndexRoutes from './routes/index.routes'
import UsuarioRoutes from './routes/usuarios.routes'
import EmpresaRoutes from './routes/empresas.routes'
import EventoRoutes from './routes/eventos.routes'

export class App {
    app: Application;

    constructor(
        // aqui variables y constantes
    ) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
        
    }

    private settings () {
        this.app.set('port', process.env.PORT);
        this.app.set('server', process.env.SERVIDOR);
        // this.app.set('server', process.env.SERVER || '/apicolavirtual');
    }
    private middlewares () {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(cors({
            origin: '*'
        }));
    }

    private routes () {
        this.app.use(this.app.get('server'), IndexRoutes);
        this.app.use(this.app.get('server') + '/usuario', UsuarioRoutes);
        this.app.use(this.app.get('server') + '/empresa', EmpresaRoutes);
        this.app.use(this.app.get('server') + '/evento', EventoRoutes);

    }

    async listen () {
        await this.app.listen(this.app.get('port'));
        console.log('Servidor en puerto ', this.app.get('port'));
        console.log('Servidor en carpeta ', this.app.get('server'));
    }

}