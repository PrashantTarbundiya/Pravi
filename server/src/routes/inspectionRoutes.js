import express from 'express'
import { getInspections, createInspection } from '../controllers/inspectionController.js'

const router = express.Router()

router.route('/')
  .get(getInspections)
  .post(createInspection)

export default router
