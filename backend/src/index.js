import { app } from './app.js'
import { initDatabase } from './db/init.js'
import dotenv from 'dotenv'
import fs from 'fs'

// Determine which env file to use
const dockerEnvPath = '.env.docker'
const defaultEnvPath = '.env'

// Load Docker environment if DOCKER_ENV is true or if .env.docker exists
if (process.env.DOCKER_ENV === 'true') {
  console.info('Running in Docker environment')
  // Docker environment set by Dockerfile or run command
  if (fs.existsSync(dockerEnvPath)) {
    dotenv.config({ path: dockerEnvPath })
    console.info(`Loaded environment from ${dockerEnvPath}`)
  } else {
    console.info(
      `${dockerEnvPath} not found, using environment variables provided at runtime`,
    )
  }
} else {
  dotenv.config({ path: defaultEnvPath })
  console.info(`Loaded environment from ${defaultEnvPath}`)
}

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    console.info(`Initializing database...`)
    console.info(`Connecting to: ${process.env.DATABASE_URL}`)
    await initDatabase()

    const server = app.listen(PORT, () => {
      console.info(`Express server started and listening on port ${PORT}`)
    })

    // Handle termination signals properly
    ;['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.on(signal, () => {
        console.info(`${signal} received, shutting down gracefully`)
        server.close(() => {
          console.info('Server closed')
          process.exit(0)
        })
      })
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
