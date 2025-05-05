import { useSocket } from '../contexts/SocketIOContext'

export function Status() {
  const { status, error } = useSocket()

  return (
    <div>
      Socket status: <b>{status}</b>
      {error && <div>Error: {error}</div>}
    </div>
  )
}
