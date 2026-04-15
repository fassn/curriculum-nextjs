import Link from 'next/link'

export default function Signup() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="max-w-lg text-center">
                <h1 className="text-2xl font-semibold dark:text-white">Signup is disabled</h1>
                <p className="mt-3 dark:text-gray-300">
                    This app uses a single admin account. Please sign in with the existing admin user.
                </p>
                <Link
                    className='inline-block mt-6 px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150'
                    href='/signin'
                >
                    Go to Sign In
                </Link>
            </div>
        </div>
    )
}
