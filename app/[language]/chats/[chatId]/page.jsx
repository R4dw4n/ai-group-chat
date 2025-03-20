import Chat from '@/app/components/Chat Page Components/Chat/Chat'
import Sidebar from '@/app/components/Chat Page Components/Sidebar/Sidebar'
import React from 'react'

function Page() {
  return (
    <div className='flex h-screen w-screen'>
      <Sidebar />
      <Chat />
    </div>
  )
}

export default Page