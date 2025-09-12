// Token management utility that handles both localStorage and cookies
export const setTokens = (accessToken, refreshToken, chatToken, username, user) => {
  // Store in localStorage (for client-side access)
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('chatToken', chatToken);
  localStorage.setItem('username', username);
  localStorage.setItem('user', JSON.stringify(user));

  // Store in cookies (for server-side access)
  const cookieOptions = {
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  // Set cookies
  document.cookie = `accessToken=${accessToken}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
  document.cookie = `refreshToken=${refreshToken}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
  document.cookie = `chatToken=${chatToken}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
  document.cookie = `username=${username}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
  document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
};

export const clearTokens = () => {
  // Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("chatToken");
  localStorage.removeItem("username");
  localStorage.removeItem("user");

  // Clear cookies
  const cookies = ['accessToken', 'refreshToken', 'chatToken', 'username', 'user'];
  cookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
};

export const getAccessToken = () => {
  // Try localStorage first (for client-side)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const getRefreshToken = () => {
  // Try localStorage first (for client-side)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const getChatToken = () => {
  // Try localStorage first (for client-side)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('chatToken');
  }
  return null;
};

export const getUsername = () => {
  // Try localStorage first (for client-side)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('username');
  }
  return null;
};

export const getUser = () => {
  // Try localStorage first (for client-side)
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};
