export default async function handler(req: any, res: any) {
  // Set CORS headers for local development and cross-origin access
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure request is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, redirectUri } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  // Support environment variables from process.env (Vercel console uses GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'Google OAuth configuration is missing on the server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
    });
  }

  try {
    // 1. Exchange OAuth code for tokens with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return res.status(tokenResponse.status).json({
        error: 'Failed to exchange token with Google',
        details: errorText,
      });
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    if (!accessToken) {
      return res.status(400).json({ error: 'No access token received from Google' });
    }

    // 2. Fetch user details from Google userinfo API
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
      return res.status(userInfoResponse.status).json({
        error: 'Failed to fetch user info from Google',
        details: errorText,
      });
    }

    const userInfo = await userInfoResponse.json();

    // 3. Return user profile back to client
    return res.status(200).json({
      success: true,
      user: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        locale: userInfo.locale,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Internal Server Error during Google Auth',
      message: error.message || error,
    });
  }
}
