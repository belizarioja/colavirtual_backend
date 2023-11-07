import { Router } from 'express';
import { getEmpresas, setEmpresa } from '../controllers/empresas.controller';

const router = Router();

router.route('/')
    .get(getEmpresas)
router.route('/')
    .post(setEmpresa)
        
export default router;