import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'

import assetRoutes from './routes/assetRoutes.js'
import complaintRoutes from './routes/complaintRoutes.js'
import inspectionRoutes from './routes/inspectionRoutes.js'
import verificationRoutes from './routes/verificationRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import workOrderRoutes from './routes/workOrderRoutes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'R&B Infrastructure Asset & AI Image Verification API',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/assets', assetRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/inspections', inspectionRoutes)
app.use('/api/verification', verificationRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/work-orders', workOrderRoutes)

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`[R&B Server]: Running on port ${PORT}`)
})
