import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketIOContext'

export function useChat() {
  const { socket } = useSocket()
  const [messages, setMessages] = useState([])
  const [currentRoom, setCurrentRoom] = useState('public')

  function receiveMessage(message) {
    setMessages((messages) => [...messages, message])
  }

  function clearMessages() {
    setMessages([])
  }

  function switchRoom(room) {
    setCurrentRoom(room)
  }

  function joinRoom(room) {
    socket.emit('chat.join', room)
    switchRoom(room)
  }

  async function getRooms() {
    const userInfo = await socket.emitWithAck('user.info', socket.id)
    const rooms = userInfo.rooms.filter((room) => room !== socket.id)

    return rooms
  }

  useEffect(() => {
    socket.on('chat.message', receiveMessage)

    return () => socket.off('chat.message', receiveMessage)
  }, [])

  async function sendMessage(message) {
    if (message.startsWith('/')) {
      const [command, ...args] = message.substring(1).split(' ')
      switch (command) {
        case 'clear':
          clearMessages()
          return
        case 'rooms': {
          const rooms = await getRooms()
          receiveMessage({
            message: `You are in the following rooms: ${rooms.join(', ')}`,
          })
          break
        }
        case 'join': {
          if (args.length === 0) {
            return receiveMessage({
              message: 'Please provide a room name: /join <room>',
            })
          }

          const room = args[0]
          const rooms = await getRooms()

          if (rooms.includes(room)) {
            return receiveMessage({
              message: `You are already in the room "${room}"`,
            })
          }

          joinRoom(room)
          break
        }
        case 'switch': {
          if (args.length === 0) {
            return receiveMessage({
              message: 'Please provide a room name: /switch <room>',
            })
          }

          const room = args[0]
          const rooms = await getRooms()

          if (!rooms.includes(room)) {
            return receiveMessage({
              message: `You are not in the room "${room}". Type "/join ${room}" to join it first.`,
            })
          }

          switchRoom(room)
          receiveMessage({
            message: `Switched to room "${room}"`,
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
      socket.emit('chat.message', currentRoom, message)
    }
  }

  return {
    messages,
    sendMessage,
  }
}
