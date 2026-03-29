const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI =
  process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/api/auth/facebook/callback";

export function getInstagramAuthUrl(): string {
  if (!FACEBOOK_APP_ID) {
    throw new Error("FACEBOOK_APP_ID non configurata.");
  }

  const params = new URLSearchParams({
    client_id: FACEBOOK_APP_ID,
    redirect_uri: FACEBOOK_REDIRECT_URI.replace("/facebook/", "/instagram/"),
    scope: "pages_show_list,instagram_basic,instagram_content_publish,pages_read_engagement",
    response_type: "code",
  });

  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}

export async function exchangeInstagramCode(code: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
    throw new Error("Facebook credentials non configurate.");
  }

  const params = new URLSearchParams({
    client_id: FACEBOOK_APP_ID,
    client_secret: FACEBOOK_APP_SECRET,
    redirect_uri: FACEBOOK_REDIRECT_URI.replace("/facebook/", "/instagram/"),
    code,
  });

  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Instagram token exchange failed: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function getInstagramAccounts(
  accessToken: string
): Promise<Array<{ id: string; username: string; name: string }>> {
  const params = new URLSearchParams({
    fields: "instagram_business_account{id,username,name}",
    access_token: accessToken,
  });

  const response = await fetch(
    `https://graph.facebook.com/me/accounts?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Instagram accounts fetch failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const accounts: Array<{ id: string; username: string; name: string }> = [];

  for (const page of data.data || []) {
    if (page.instagram_business_account) {
      accounts.push({
        id: page.instagram_business_account.id,
        username: page.instagram_business_account.username || page.name,
        name: page.instagram_business_account.name || page.name,
      });
    }
  }

  return accounts;
}

export async function publishInstagramPost(
  accessToken: string,
  igAccountId: string,
  imageUrl: string,
  caption: string
): Promise<{ id: string }> {
  // Step 1: Create media container
  const createParams = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  });

  const createResponse = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media?${createParams.toString()}`,
    { method: "POST" }
  );

  if (!createResponse.ok) {
    const error = await createResponse.text();
    throw new Error(`Instagram create media failed: ${createResponse.status} - ${error}`);
  }

  const container = await createResponse.json();

  // Step 2: Publish the container
  const publishParams = new URLSearchParams({
    creation_id: container.id,
    access_token: accessToken,
  });

  const publishResponse = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media_publish?${publishParams.toString()}`,
    { method: "POST" }
  );

  if (!publishResponse.ok) {
    const error = await publishResponse.text();
    throw new Error(`Instagram publish failed: ${publishResponse.status} - ${error}`);
  }

  return publishResponse.json();
}
