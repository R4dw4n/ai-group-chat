'use client'
import React from 'react'
import { ConfigProvider, theme } from 'antd';

const { darkAlgorithm } = theme;

function AntDesignProvider({ children }) {
  return (
    <ConfigProvider 
      // theme={{
        // algorithm: darkAlgorithm
      // }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntDesignProvider