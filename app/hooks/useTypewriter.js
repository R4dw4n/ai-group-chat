import { useState, useEffect, useCallback } from 'react';

const useTypewriter = (text, duration = 1000, delay = 0) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [restarter, setRestarter] = useState(false);

  useEffect(() => {
    // Start the typing effect after the initial delay
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      setShowCursor(true);
    }, delay);

    return () => clearTimeout(startTimeout); // Cleanup on unmount
  }, [delay, restarter]);

  // Handle typing
  useEffect(() => {
    if (isTyping && currentIndex < text.length) {
      // Typing a charectar
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, duration / text.length);

      return () => clearTimeout(timeout)  // Cleanup on unmount
    } else if (currentIndex === text.length) {
      // Stopping cursor from blinking
      setIsTyping(false);
      setShowCursor(false);
    }
  }, [currentIndex, duration, text, isTyping]);

  // Handle cursor blinking logic
  useEffect(() => {
    if (isTyping) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev); // Toggle cursor visibility
      }, 200); // Blink every 200ms

      return () => clearInterval(cursorInterval); // Cleanup on unmount
    }
  }, [isTyping]);

  const restart = useCallback(() => {
    setCurrentText('');
    setCurrentIndex(0);
    setRestarter(prev => !prev);
  }, [])

  return { currentText, showCursor, restart };
};

export default useTypewriter;