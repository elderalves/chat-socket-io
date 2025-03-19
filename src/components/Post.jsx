import PropTypes from 'prop-types'

export function Post({ title, contents, author }) {
  return (
    <article className='p-6 bg-white shadow-md rounded-lg border border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
      <div className='mt-2 text-gray-700'>{contents}</div>
      {author && (
        <p className='mt-3 text-gray-600'>
          <strong>Written by:</strong> {author}
        </p>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
}
