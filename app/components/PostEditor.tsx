'use client'

import Quill from 'quill'
import addPost from '../data/posts/add-post'
import ValidationErrors from './form/ValidationErrors'
import { useEffect, useRef, useState } from 'react'
import editPost from '../data/posts/edit-post'
import { Post } from '../types/post'
import { useRouter } from 'next/navigation'

export default function PostEditor({ postId, post }: { postId?: string, post?: Post }) {
    const editorRef = useRef<Quill | null>(null)
    const editorContainerRef = useRef<HTMLDivElement | null>(null)
    const initialContentRef = useRef(post?.content ?? '')
    const [dirty, setDirty] = useState(false)
    const [errors, setErrors] = useState<string[]>([])
    const route = useRouter()

    useEffect(() => {
        if (!editorContainerRef.current || editorRef.current) {
            return
        }

        const host = editorContainerRef.current
        host.innerHTML = ''
        const editorElement = document.createElement('div')
        host.appendChild(editorElement)

        const editor = new Quill(editorElement, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block', 'link'],
                    [{ align: [] }],
                    ['clean'],
                ],
            },
        })

        editor.root.innerHTML = initialContentRef.current
        editor.on('text-change', () => {
            const content = editor.root.innerHTML
            setDirty(content !== initialContentRef.current)
        })
        editorRef.current = editor

        return () => {
            editorRef.current = null
            host.innerHTML = ''
        }
    }, [])

    const handleSave = async () => {
        if (!editorRef.current) {
            return
        }

        setErrors([])
        const content = editorRef.current.root.innerHTML.trim()
        if (!content || content === '<p><br></p>') {
            setErrors(['Post content is required.'])
            return
        }

        // New post
        if (!postId) {
            const res = await addPost(content)
            if (res?.id) {
                initialContentRef.current = content
                setDirty(false)
                route.push('/admin/post/edit/' + res.id)
                return
            }
            if (res?.error) {
                setErrors([res.error])
                return
            }
            setErrors(['Could not save post. Please try again.'])
            return
        }

        // Edit post
        if (postId && post) {
            const updatedPost = { ...post, content }
            const res = await editPost(postId, updatedPost)
            if (res?.error) {
                setErrors([res.error])
                return
            }
            if (!res?.id) {
                setErrors(['Could not update post. Please try again.'])
                return
            }
            initialContentRef.current = content
            setDirty(false)
        }
    }

    return (
        <div className='flex w-full lg:w-1/2 m-auto justify-center'>
            <div className='flex-col'>
                <div className='post-editor'>
                    <div ref={editorContainerRef}></div>
                </div>
                <div>
                    <button
                        className={`w-full mt-4 items-center px-4 py-2 bg-gray-800 dark:bg-gray-200  border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
                        onClick={handleSave}
                        disabled={!dirty}
                    >Save Post</button>
                    { dirty && <p className='text-gray-700 dark:text-gray-100 text-center'>You have unsaved content!</p> }
                    {/* Validation Errors */}
                    <ValidationErrors className="mb-4" errors={errors} />
                </div>
            </div>
        </div>
    )
}
