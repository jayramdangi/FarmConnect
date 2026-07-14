const logoutController = async (req, res) => {
  try {
    // Get all cookies from the request
    const cookies = req.cookies;
    
    // Clear all cookies present in the request
    Object.keys(cookies).forEach(cookieName => {
      res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
    });

    // Alternative: If you want to clear specific cookies instead of all:
    // res.clearCookie('accessToken', { same options });
    // res.clearCookie('refreshToken', { same options });

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout',
    });
  }
};

export default logoutController;