import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext'
import { User } from './User'
import { useSocket } from '../contexts/SocketIOContext'

export function Header() {
  const [token, setToken] = useAuth()
  const { socket } = useSocket()

  const handleLogout = () => {
    socket.disconnect()
    setToken(null)
  }

  if (token) {
    const { sub } = jwtDecode(token)

    return (
      <div>
        Logged in as <User id={sub} />
        <br />
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <Link to='/login'>Log In</Link> |<Link to='/signup'>Sign Up</Link>
    </div>
  )
}
