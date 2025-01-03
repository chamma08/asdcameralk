import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <main className='p-4'>
        <h1>Dashboard</h1>
        <Link href="/admin">Admin Panel</Link>
    </main>
  )
}
