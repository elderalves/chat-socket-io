import mongoose from 'mongoose'

export async function initDatabase() {
  const DATABASE_URL =
    process.env.DATABASE_URL || 'mongodb://localhost:27017/mongoose'

  console.info(`Attempting to connect to MongoDB at: ${DATABASE_URL}`)

  if (process.env.CLOUD_RUN === 'true') {
    console.info('Running in Cloud Run environment')
    if (
      !DATABASE_URL.includes('mongodb+srv') &&
      !DATABASE_URL.includes('mongodb://')
    ) {
      console.warn(
        'WARNING: Cloud Run requires an external MongoDB instance (MongoDB Atlas or GCP MongoDB)',
      )
    }
  }

  // When running in Docker, check if we're using localhost and provide a helpful message
  if (process.env.DOCKER_ENV === 'true' && DATABASE_URL.includes('localhost')) {
    console.warn(
      'WARNING: Using localhost in Docker environment may cause connection issues.',
    )
    console.warn(
      'Consider using host.docker.internal instead of localhost for Mac/Windows.',
    )
  }

  mongoose.connection.on('open', () => {
    console.info('Successfully connected to the database: ', DATABASE_URL)
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
    console.info(
      'Hint: If running in Docker, make sure to connect to the host MongoDB service',
    )
    console.info(
      'For Mac/Windows, use: mongodb://host.docker.internal:27017/blog',
    )
    console.info(
      'For Linux, use: mongodb://172.17.0.1:27017/blog or add --network="host" to your docker run command',
    )
  })

  // Set connection timeout to fail fast if DB is unreachable
  const options = {
    serverSelectionTimeoutMS: 5000, // 5 seconds
    connectTimeoutMS: 10000, // 10 seconds,
    // These options help with MongoDB Atlas connections
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  try {
    const connection = await mongoose.connect(DATABASE_URL, options)
    console.info('Database connection established successfully.')
    return connection
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    console.info('Make sure your MongoDB service is up and reachable.')
    throw error
  }
}
