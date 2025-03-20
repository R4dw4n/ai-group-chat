import React from 'react'
import ChatToolbar from './ChatToolbar'
import ChatArea from './ChatArea'

function Chat() {
  return (
    <div className='h-screen flex-1'>
      <ChatToolbar />
      <ChatArea />
    </div>
  )
}

export default Chat