'use client'

import { Editor } from '@tinymce/tinymce-react'
import addPost from '../firebase/firestore/add-post';
import ValidationErrors from './validation-errors';
import { useRef, useState } from 'react';
import editPost from '../firebase/firestore/edit-post';
import { Post } from '../types/post';
import { useRouter } from 'next/navigation';

export default function TinyMCE({ postId, post }: { postId?: string, post?: Post }) {
    const editorRef = useRef(null);
    const [dirty, setDirty] = useState(false)
    const [errors, setErrors] = useState([])
    const route = useRouter()

    const handleSave = async () => {
        if (editorRef.current) {
            setErrors([])
            const content = editorRef.current.getContent({ format: 'text' })
            setDirty(false)
            editorRef.current.setDirty(false)

            // New post
            if (!postId) {
                const res = await addPost(content)
                if (res?.id) {
                    route.push('/admin/post/edit/' + res.id)
                }
                if (res?.error) {
                    console.log({res});
                    setErrors([res])
                    return
                }
            }

            // Edit post
            if (postId) {
                post.content = content
                const res = await editPost(postId, post)
                if (res?.error) {
                    console.log({res});
                    setErrors([res])
                    return
                }
            }
        }
    }

    return (
        <div className='flex w-full lg:w-1/2 m-auto justify-center'>
            <div className='flex-col'>
                <Editor
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={post?.content}
                    onDirty={() => setDirty(true)}
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    init={{
                        height: '80vh',
                        content_css: 'dark',
                        auto_focus: true    ,
                        plugins: 'tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        mergetags_list: [
                            { value: 'First.Name', title: 'First Name' },
                            { value: 'Email', title: 'Email' },
                        ],
                    }}
                />
                <div>
                    <button
                        className={`w-full mt-4 items-center px-4 py-2 bg-gray-800 dark:bg-gray-200  border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
                        onClick={handleSave}
                        disabled={!dirty}
                    >Save Post</button>
                    { dirty && <p className='text-white text-center'>You have unsaved content!</p> }
                    {/* Validation Errors */}
                    <ValidationErrors className="mb-4" errors={errors} />
                </div>
            </div>
        </div>
    )
}