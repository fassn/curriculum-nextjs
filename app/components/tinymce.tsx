import { Editor } from '@tinymce/tinymce-react'
import { useRef, useState } from 'react';

export default function TinyMCE() {
    const editorRef = useRef(null);
    const [dirty, setDirty] = useState(false)

    const handleSave = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent()
            console.log({content});
            setDirty(false)
            editorRef.current.setDirty(false)

            // push to DB here
            // TODO
        }
    }

    return (
        <div className='flex w-full lg:w-1/2 m-auto justify-center'>
            <div className='flex-col'>
                <Editor
                    onInit={(evt, editor) => editorRef.current = editor}
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
                </div>
            </div>
        </div>
    )
}