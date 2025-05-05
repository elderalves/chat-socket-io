import PropTypes from 'prop-types'

export function ChatMessage({ username, message }) {
  console.log('message', message)
  console.log('username', username)
  return (
    <div>
      {username ? (
        <span>
          <b>{username}</b>: {message}
        </span>
      ) : (
        <i>{message}</i>
      )}
    </div>
  )
}

ChatMessage.propTypes = {
  username: PropTypes.string,
  message: PropTypes.string.isRequired,
}
