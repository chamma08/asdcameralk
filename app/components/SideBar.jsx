"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "All Categories", src: "Chart_fill" },
    { title: "Action Camera", src: "Chat" },
    { title: "Lenses", src: "User" },
    { title: "Backpacks ", src: "Calendar" },
    { title: "Iphone", src: "Search" },
    { title: "Packages", src: "Chart" },
    { title: "Lights", src: "Folder" },
    { title: "Drones", src: "Setting" },
  ];

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={` ${
        open ? "w-56 bg-white backdrop-blur-xl" : "w-20 bg-white"
      } bg-transparent rounded-xl border-2 border-gray-400 mt-2 ml-1 h-50 p-5 z-30 pt-8 fixed duration-200 `}
    >
      <img
        src="/control.png"
        className={`absolute cursor-pointer -right-3 top-9 w-7 border-gray-400
           border-2 rounded-full  ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      />
      <div className="flex gap-x-4 items-center">
        {/* <motion.img
          src="/logo.png"
          initial={{ scale: 1 }}
          animate={{ scale: open ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          className="cursor-pointer"
        /> */}
        {/* <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            
          </h1> */}
      </div>
      <ul className="pt-6">
        {Menus.map((Menu, index) => (
          <li
            key={index}
            className={`flex rounded-md p-2 cursor-pointer hover:text-red-700 text-black text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
              index === 0 && "bg-red-500 text-white"
            } `}
          >
            <img src={`/${Menu.src}.png`} />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              {Menu.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;