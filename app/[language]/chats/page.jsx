import Chat from '@/app/components/Chat Page Components/Chat/Chat'
import Sidebar from '@/app/components/Chat Page Components/Sidebar/Sidebar'
import React from 'react'

function Page() {
  return (
    <div className='flex h-screen w-screen'>
      <Sidebar />
      <h1 className='text-center m-auto text-6xl text-white py-24'>Start Chatting!</h1>
    </div>
  )
}

export default Page