import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Blog } from './pages/Blog'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { AuthContextProvider } from './contexts/AuthContext'

console.log(`localStorage.getItem('token')`, localStorage.getItem('token'))

const socket = io(import.meta.env.VITE_SOCKET_HOST, {
  query: window.location.search.substring(1),
  auth: {
    token: localStorage.getItem('token'),
  },
})

socket.on('connect', async () => {
  console.log('Connected to socket server', socket.id)
  socket.emit('chat.message', 'Hello from client')

  const userInfo = await socket.emitWithAck('user.info', socket.id)
  console.log('User info:', userInfo)
})

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error)
})

socket.on('chat.message', (data) => {
  console.log('Received message:', data)
})

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Blog />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
