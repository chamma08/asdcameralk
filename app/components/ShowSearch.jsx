import React from 'react'
import { FaSearch } from 'react-icons/fa'

const ShowSearch = () => {
  return (
    <div className="py-4 pb-7">
    <div className="text-center">
      <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white overflow-hidden w-full">
        <input
          type="text"
          /* value={search} */
          /* onChange={(e) => setSearch(e.target.value)} */
          placeholder="Search"
          className="border-none outline-none w-full bg-white text-sm"
        />
        <div className="bg-white text-center">
          <FaSearch className="cursor-pointer"/>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ShowSearch
