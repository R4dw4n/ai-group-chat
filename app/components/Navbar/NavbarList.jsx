import React from 'react'
import { NavbarItems } from './NavbarItems'
import Link from 'next/link'

function NavbarList() {
  return (
    <div className='flex'>
      {NavbarItems.map((item, ind) => {
        return NavItem(item, ind)
      })}
    </div>
  )
}

const NavItem = (item, ind) => (
  <div key={ind} className='w-28 h-16 flex justify-center items-center text-navigation-gray'>
    <Link href={item.link} className='text-center text-xl hover:text-white transition-colors duration-150'>
      {item.label}
    </Link>
  </div>
)

export default NavbarList