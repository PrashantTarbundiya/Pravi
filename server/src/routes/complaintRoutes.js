import express from 'express'
import { getComplaints, getComplaintByTicket, createComplaint, auditReviewComplaint } from '../controllers/complaintController.js'

const router = express.Router()

router.route('/')
  .get(getComplaints)
  .post(createComplaint)

router.route('/:ticketNumber')
  .get(getComplaintByTicket)

router.route('/:ticketNumber/audit-review')
  .post(auditReviewComplaint)

export default router
