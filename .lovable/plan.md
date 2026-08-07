# Clear Apple's China (Guideline 5) Notice — No Code Changes

Apple flagged the words "ChatGPT" / "GPT" in the App Store listing. Chinese law requires a government license for AI services like ChatGPT, so the app can't ship on the China mainland store with those references. The fix chosen: remove China mainland from availability. Everywhere else stays exactly as-is.

Nothing in the app, the website, or Kayla changes. No new build is required.

## What you need to do in App Store Connect

1. Open App Store Connect → **My Apps** → **1325.AI**.
2. In the left sidebar, click **Pricing and Availability**.
3. Under **Availability**, click **Edit** (or "Set up availability").
4. Uncheck **China mainland**. Leave every other country checked.
5. Click **Done**, then **Save** in the top right.
6. Go back to the flagged submission (ID 9fd838fa-3341-4c8d-90c4-d6fcd7489547) and open **Review Notes**. Add the note below.
7. Reply to Apple's message in App Store Connect with the reply below.
8. Click **Add for Review** / **Submit for Review** to resubmit the same build (25.1.2, build 34). You do not need a new build from Xcode.

## Review Notes to add

```text
This app is not distributed on the China mainland App Store. China mainland
has been deselected in Pricing and Availability. All ChatGPT/OpenAI-related
functionality and metadata references apply only to storefronts outside of
China, per Guideline 5 - Legal.
```

## Reply to send to App Review

```text
Hello,

Thank you for the review and for flagging this.

We have deselected China mainland in the app's Availability settings in App
Store Connect. 1325.AI is no longer distributed on the China mainland App
Store, so the ChatGPT/OpenAI references in our metadata and the associated
functionality are not offered to users in China.

We have also updated the Review Notes to confirm this. The submission is
otherwise unchanged and ready for review.

Please let us know if anything further is needed.

Best regards,
Thomas Bowling
1325.AI
```

## Notes

- Keep this in mind for future releases: if you ever want the China storefront back, the app would need the ChatGPT/OpenAI wording removed from the listing and those AI features disabled for Chinese users, plus local legal advice.
- The `/connect` and `/connect-chatgpt` pages on the website are unaffected — Apple's notice is about the App Store listing and the China storefront only.
