import DOMPurify from 'isomorphic-dompurify'
import { formatFrenchDate } from '@/app/lib/date-format'
import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Blog() {
    const posts = await prisma.post.findMany({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    })

    if (posts.length === 0) {
        return <div>No posts yet.</div>
    }

    return (
        <div className="flex flex-col max-w-6xl py-4 px-6 lg:px-8 sm:mx-4 xl:mx-auto">
            <ul>
                {posts.map((post) => (
                    <li
                        className="w-full p-4 mb-10 bg-white dark:bg-gray-700 shadow-sm shadow-gray-400 dark:shadow-none rounded"
                        key={post.id}
                    >
                        <div className="w-fit h-8 mb-6">
                            {formatFrenchDate(post.createdAt)}
                            <hr className="mt-2"></hr>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
