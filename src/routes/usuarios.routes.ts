import { Router } from 'express';
import { getLogin, getRoles, getTipoDocumentos, getUsuarios, setUsuario } from '../controllers/usuarios.controller';

const router = Router();

router.route('/').get(getUsuarios)
router.route('/roles').get(getRoles)
router.route('/tipos').get(getTipoDocumentos)
router.route('/login').post(getLogin)
router.route('/crear').post(setUsuario)
        
export default router;