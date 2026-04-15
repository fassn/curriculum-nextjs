import { ReactNode } from 'react'
import { requireAuthenticatedAdmin } from '@/app/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
    await requireAuthenticatedAdmin()
    return children
}
