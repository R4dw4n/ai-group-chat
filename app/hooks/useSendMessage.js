import { useState, useEffect, useCallback } from 'react';

const useSendMessage = () => {
  const [message, setMessage] = useState("");

  const updateMessage = useCallback((message) => {
    setMessage(() => message)
  }, [])
};

export default useSendMessage;