import express from 'express'
import { getDashboardSummary } from '../controllers/statsController.js'

const router = express.Router()

router.get('/summary', getDashboardSummary)

export default router
