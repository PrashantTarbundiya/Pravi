import express from 'express'
import multer from 'multer'
import {
  requestCaptureToken,
  uploadAndVerifyImage,
  verifyDirect,
  getAuditQueue,
  getImageFromDb,
} from '../controllers/verificationController.js'

// Store image strictly in memory — no disk uploads!
// "here stre image in db only"
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed!'), false)
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
  fileFilter,
})

const router = express.Router()

router.post('/token', requestCaptureToken)
router.post('/upload', upload.single('image'), uploadAndVerifyImage)
router.post('/verify', verifyDirect)
router.get('/audit-queue', getAuditQueue)
router.get('/images/:id', getImageFromDb)

export default router