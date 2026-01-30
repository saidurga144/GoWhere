# Firebase OAuth Setup for Production Deployment

## Issue: "The requested action is invalid"

This error occurs when Firebase is not configured for your deployment domain. Firebase has strict security requirements for OAuth redirects.

## Solution: Configure Firebase for Your Deployment Domain

### Step 1: Get Your Deployment URL
Your app is deployed at: `https://gowhere-rosy.vercel.app/`

### Step 2: Add Domain to Firebase Console

1. **Go to Firebase Console**
   - URL: https://console.firebase.google.com/
   - Project: `studio-6695301123-9c419`

2. **Navigate to Authentication Settings**
   - Left sidebar → Authentication
   - Click on "Settings" tab
   - Scroll to "Authorized domains" section

3. **Add Your Vercel Domain**
   - Click "Add domain"
   - Enter: `gowhere-rosy.vercel.app`
   - Click "Add"

4. **If you have a custom domain, add that too**
   - Example: `yourdomain.com`

### Step 3: Verify Google OAuth Provider

1. **Check Google Sign-in is Enabled**
   - In Authentication → Sign-in method
   - Look for "Google"
   - Should show "Enabled" with a blue checkmark

2. **If not enabled:**
   - Click on Google provider
   - Toggle "Enable" to ON
   - Fill in OAuth credentials:
     - Client ID: Your Google Cloud Console Client ID
     - Client secret: Your Google Cloud Console Client secret
   - Click "Save"

### Step 4: Configure GitHub OAuth (if using)

1. **In Authentication → Sign-in method**
   - Click on GitHub provider
   - Toggle "Enable" to ON
   - Get OAuth credentials from GitHub:
     - Go to: https://github.com/settings/developers
     - OAuth Apps → New OAuth App
     - Authorization callback URL: `https://studio-6695301123-9c419.firebaseapp.com/__/auth/handler`
   - Enter Client ID and Client secret
   - Click "Save"

### Step 5: Test the Deployment

1. Visit: `https://gowhere-rosy.vercel.app/`
2. Click "Sign up with Google"
3. Complete OAuth flow
4. Should be redirected to dashboard

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "The requested action is invalid" | Domain not authorized | Add domain to Firebase Console > Authorized domains |
| "Operation not allowed" | OAuth provider disabled | Enable provider in Firebase Console > Sign-in method |
| Redirect loop | Wrong redirect URL | Verify authorized domain matches your deployment URL |
| OAuth popup blocked | Browser security | Check that popups are allowed for the domain |

## Production Checklist

- [ ] Visit Firebase Console: https://console.firebase.google.com/
- [ ] Project selected: `studio-6695301123-9c419`
- [ ] Domain added to "Authorized domains": `gowhere-rosy.vercel.app`
- [ ] Google OAuth provider enabled with credentials
- [ ] GitHub OAuth provider enabled (if using)
- [ ] Test link: https://gowhere-rosy.vercel.app/
- [ ] Click Google sign-in button
- [ ] Complete OAuth flow successfully

## Alternative: Email/Password Only (Temporary)

If you can't configure OAuth immediately:

1. **Hide OAuth buttons temporarily**
   - In `components/AuthView.tsx`
   - Wrap OAuth sections in conditional: `{process.env.NODE_ENV !== 'production'}`

2. **Use Email/Password auth** for production testing

3. **Then configure OAuth** once domain setup is complete

## For Custom Domain

If you have a custom domain (e.g., yourdomain.com):

1. Add to authorized domains: `yourdomain.com`
2. Update Firebase config if hosting on custom domain
3. Update deployment settings in Vercel

## Firebase Project Details

- **Project ID**: `studio-6695301123-9c419`
- **Auth Domain**: `studio-6695301123-9c419.firebaseapp.com`
- **Console**: https://console.firebase.google.com/project/studio-6695301123-9c419/authentication

---

**Need Help?**
- Firebase Auth Docs: https://firebase.google.com/docs/auth/web/google-signin
- Vercel Deployment: https://vercel.com/docs
- Firebase Console: https://console.firebase.google.com/

**Status**: After configuring Firebase, OAuth should work on production. ✅
