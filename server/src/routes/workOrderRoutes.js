import express from 'express'
import {
  getWorkOrders,
  getWorkOrderById,
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
} from '../controllers/workOrderController.js'

const router = express.Router()

router.route('/')
  .get(getWorkOrders)
  .post(createWorkOrder)

router.route('/:id')
  .get(getWorkOrderById)
  .put(updateWorkOrder)
  .delete(deleteWorkOrder)

export default router
