import { Router } from 'express';
import { getEventos, setEvento, getEventosActivos, getNumero, getSiguiente, updActivoEvento } from '../controllers/eventos.controller';

const router = Router();

router.route('/').get(getEventos)
router.route('/').post(setEvento)
router.route('/activos').post(getEventosActivos)
router.route('/actualizar').post(updActivoEvento)
router.route('/obtenernumero').post(getNumero)
router.route('/obtenersiguiente').post(getSiguiente)
export default router;