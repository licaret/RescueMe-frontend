from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://mail.google.com/"]

flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES, redirect_uri="http://localhost")

auth_url, _ = flow.authorization_url(prompt="consent")

print("\nOpen this URL in your browser to authorize the app:")
print(auth_url)

auth_code = input("\nPaste the authorization code here: ")

creds = flow.fetch_token(code=auth_code)

print("\nAccess Token:", creds['access_token'])
print("\nRefresh Token:", creds['refresh_token'])

# helena@LAPTOP-M0S4GS1O:/mnt/c/Users/Helena/OneDrive/Desktop/LICENTA/frontend/src/assets$ python3 generate_oauth2_token.py

