import React from 'react'
import ChatToolbar from './ChatToolbar'
import ChatArea from './ChatArea'

function Chat({ chatId }) {

  return (
    <div className='h-screen flex-1'>
      <ChatToolbar />
      <ChatArea chatId={chatId} />
    </div>
  )
}

export default Chat