import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 30000, // 30s timeout for Atlas cloud
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    })

    console.log(`[MongoDB Connected]: ${conn.connection.host}`)

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Error]:`, err.message)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn(`[MongoDB Warning]: Disconnected. Reconnecting...`)
    })
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`)
  }
}
