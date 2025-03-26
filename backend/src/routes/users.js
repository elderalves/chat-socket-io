import { createUser, loginUser, getUserInfoById } from '../services/users.js'

export function userRoutes(app) {
  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      return res.status(201).json({
        username: user.username,
      })
    } catch (err) {
      return res.status(400).json({
        error: 'failed to create the user, does the username already exist?',
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      return res.status(200).send({
        token,
      })
    } catch (err) {
      return res.status(400).json({
        error: 'login failed, did you enter the correct username/password?',
      })
    }
  })

  app.get('/api/v1/user/:id', async (req, res) => {
    const { id } = req.params

    try {
      const user = await getUserInfoById(id)

      if (!user) {
        return res.status(404).json({
          error: 'user not found',
        })
      }

      return res.status(200).send(user)
    } catch (err) {
      return res.status(500).json({
        error: 'internal server error',
      })
    }
  })
}
