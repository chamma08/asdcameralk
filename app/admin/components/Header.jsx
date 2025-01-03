import { Avatar } from '@nextui-org/react'
import { Menu } from 'lucide-react'
import React from 'react'

export default function Header({ toggleSidebar }) {
  return (
    <section className=" flex items-center gap-3 bg-white border-b px-4 py-3">
      <div className="flex justify-center items-center md:hidden">
        <button onClick={toggleSidebar}>
          <Menu />
        </button>
      </div>
      <div className="w-full flex justify-between items-center pr-0 md:pr-[260px]">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex gap-2 items-center">
          <div className="md:flex flex-col items-end hidden">
            <h1 className="text-sm font-semibold">{/* {admin?.name} */}admin</h1>
            <h1 className="text-xs text-gray-600">{/* {admin?.email} */}admin@gmail.com</h1>
          </div>
          <Avatar size="sm" />
        </div>
      </div>
    </section>
  )
}
