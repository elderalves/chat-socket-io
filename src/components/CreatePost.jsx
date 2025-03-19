import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DevTool } from '@hookform/devtools'
import { createPost } from '../api/posts'

export function CreatePost() {
  const schema = z.object({
    createTitle: z.string().nonempty(),
    createAuthor: z.string().nonempty(),
    contents: z.string().nonempty(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  })

  const queryClient = useQueryClient()
  const title = useWatch({
    control,
    name: 'createTitle',
  })

  const { createAuthor, contents } = getValues()

  const createPostMutation = useMutation({
    mutationFn: () => createPost({ title, author: createAuthor, contents }),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })

  const onSubmit = () => {
    createPostMutation.mutate()
  }

  return (
    <div className='max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl'>
      <h2 className='text-xl font-semibold text-gray-700 mb-4'>
        Create a New Post
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label
            htmlFor='createTitle'
            className='block text-gray-600 font-medium'
          >
            Title:
          </label>
          <input
            type='text'
            {...register('createTitle', { required: true })}
            className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
          />
          {errors.createTitle && (
            <p className='text-red-500 text-sm mt-1'>Title is required.</p>
          )}
        </div>

        <div>
          <label
            htmlFor='createAuthor'
            className='block text-gray-600 font-medium'
          >
            Author:
          </label>
          <input
            type='text'
            {...register('createAuthor', { required: true })}
            className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
          />
          {errors.createAuthor && (
            <p className='text-red-500 text-sm mt-1'>Author is required.</p>
          )}
        </div>

        <div>
          <label htmlFor='contents' className='block text-gray-600 font-medium'>
            Content:
          </label>
          <textarea
            {...register('contents', { required: true })}
            rows={4}
            className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
          />
          {errors.contents && (
            <p className='text-red-500 text-sm mt-1'>Content is required.</p>
          )}
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
          disabled={!title || createPostMutation.isPending}
        >
          {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
        </button>

        {createPostMutation.isSuccess && (
          <p className='mt-3 text-green-600 font-medium'>
            Post created successfully!
          </p>
        )}
      </form>
      <DevTool control={control} />
    </div>
  )
}
