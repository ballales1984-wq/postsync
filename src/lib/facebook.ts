const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI =
  process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/api/auth/facebook/callback";

export function getFacebookAuthUrl(): string {
  if (!FACEBOOK_APP_ID) {
    throw new Error("FACEBOOK_APP_ID non configurata.");
  }

  const params = new URLSearchParams({
    client_id: FACEBOOK_APP_ID,
    redirect_uri: FACEBOOK_REDIRECT_URI,
    scope: "pages_manage_posts,pages_read_engagement,pages_show_list",
    response_type: "code",
  });

  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}

export async function exchangeFacebookCode(code: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
    throw new Error("Facebook credentials non configurate.");
  }

  const params = new URLSearchParams({
    client_id: FACEBOOK_APP_ID,
    client_secret: FACEBOOK_APP_SECRET,
    redirect_uri: FACEBOOK_REDIRECT_URI,
    code,
  });

  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook token exchange failed: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function getFacebookUser(accessToken: string): Promise<{
  id: string;
  name: string;
}> {
  const params = new URLSearchParams({
    fields: "id,name",
    access_token: accessToken,
  });

  const response = await fetch(`https://graph.facebook.com/me?${params.toString()}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook user fetch failed: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function getFacebookPages(accessToken: string): Promise<
  Array<{ id: string; name: string; access_token: string }>
> {
  const params = new URLSearchParams({
    access_token: accessToken,
  });

  const response = await fetch(
    `https://graph.facebook.com/me/accounts?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook pages fetch failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data || [];
}

export async function publishToFacebookPage(
  pageAccessToken: string,
  pageId: string,
  message: string
): Promise<{ id: string; post_id: string }> {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        access_token: pageAccessToken,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook publish failed: ${response.status} - ${error}`);
  }

  return response.json();
}
