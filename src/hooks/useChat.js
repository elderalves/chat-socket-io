import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketIOContext'

export function useChat() {
  const { socket } = useSocket()
  const [messages, setMessages] = useState([])

  function receiveMessage(message) {
    setMessages((messages) => [...messages, message])
  }

  useEffect(() => {
    socket.on('chat.message', receiveMessage)

    return () => socket.off('chat.message', receiveMessage)
  }, [])

  async function sendMessage(message) {
    if (message.startsWith('/')) {
      const command = message.substring(1)
      switch (command) {
        case 'clear':
          setMessages([])
          return
        case 'rooms': {
          const userInfo = await socket.emitWithAck('user.info', socket.id)
          const rooms = userInfo.rooms.filter((room) => room !== socket.id)
          receiveMessage({
            message: `You are in the following rooms: ${rooms.join(', ')}`,
          })
          break
        }
        default:
          receiveMessage({
            message: `Unknown command: ${command}`,
          })
          break
      }
    } else {
      socket.emit('chat.message', message)
    }
  }

  return {
    messages,
    sendMessage,
  }
}
