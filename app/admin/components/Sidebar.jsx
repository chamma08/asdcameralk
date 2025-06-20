"use client";

import { auth } from "@/lib/firestore/firebase";
import { signOut } from "firebase/auth";
import {
  Cat,
  GalleryHorizontal,
  GalleryHorizontalEnd,
  Layers2,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Mail,
  PackageOpen,
  Share,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
  UserCog,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function Sidebar() {
  const menuList = [
    {
      name: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Images Slider",
      link: "/admin/images",
      icon: <GalleryHorizontalEnd className="h-5 w-5" />,
    },
    {
      name: "Background Image",
      link: "/admin/backgroundImage",
      icon: <GalleryHorizontal className="h-5 w-5" />,
    },
    {
      name: "Pop-up Message",
      link: "/admin/pop-up-message",
      icon: <Share className="h-5 w-5"/>
    },
    {
      name: "Configurations",
      link: "/admin/configurations",
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      name: "Products",
      link: "/admin/products",
      icon: <PackageOpen className="h-5 w-5" />,
    },
    {
      name: "Categories",
      link: "/admin/categories",
      icon: <Layers2 className="h-5 w-5" />,
    },
    {
      name: "Client Logos",
      link: "/admin/client-logos",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      name: "Client Messages",
      link: "/admin/client-messages",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      name: "Brands",
      link: "/admin/brands",
      icon: <Cat className="h-5 w-5" />,
    },
    {
      name: "Banners",
      link: "/admin/banners",
      icon: <GalleryHorizontal className="h-5 w-5" />,
    },
    /* {
      name: "Orders",
      link: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    }, */
    {
      name: "Customers",
      link: "/admin/customers",
      icon: <User className="h-5 w-5" />,
    },
    /* {
      name: "Reviews",
      link: "/admin/reviews",
      icon: <Star className="h-5 w-5" />,
    }, */
    /* {
      name: "Collections",
      link: "/admin/collections",
      icon: <LibraryBig className="h-5 w-5" />,
    }, */
    {
      name: "Admins",
      link: "/admin/admins",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];
  return (
    <section className="sticky top-0 flex flex-col gap-10 bg-white border-r px-5 py-3 h-screen overflow-hidden w-[260px] z-1000">
      <div className="flex justify-center py-4">
        <Link href={`/`}>
          <img className="h-8" src="/logo.png" alt="" />
        </Link>
      </div>
      <ul className="flex-1 h-full overflow-y-auto flex flex-col gap-4">
        {menuList?.map((item, key) => {
          return <Tab item={item} key={key} />;
        })}
      </ul>
      <div className="flex justify-center">
        <button
          onClick={async () => {
            try {
              await toast.promise(signOut(auth), {
                error: (e) => e?.message,
                loading: "Loading...",
                success: "Successfully Logged out",
              });
            } catch (error) {
              toast.error(error?.message);
            }
          }}
          className="flex gap-2 items-center px-3 py-2 hover:bg-red-800 hover:text-white rounded-xl w-full justify-center ease-soft-spring duration-400 transition-all"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </section>
  );
}

function Tab({ item }) {
  const pathname = usePathname();
  const isSelected = pathname === item?.link;
  return (
    <Link href={item?.link}>
      <li
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ease-soft-spring transition-all duration-300 hover:bg-[#f53333] cursor-pointer hover:text-white
          ${isSelected ? "bg-[#f53333] text-white" : "bg-white text-black"} 
          `}
      >
        {item?.icon} {item?.name}
      </li>
    </Link>
  );
}
