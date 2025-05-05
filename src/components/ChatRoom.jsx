import { useChat } from '../hooks/useChat'
import { EnterMessage } from './EnterMessage'
import { ChatMessage } from './ChatMessage'

export function ChatRoom() {
  const { messages, sendMessage } = useChat()

  console.log('messages', messages)

  return (
    <div>
      {messages.map((message, index) => (
        <ChatMessage key={index} {...message} />
      ))}

      <EnterMessage onSend={sendMessage} />
    </div>
  )
}
