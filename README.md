# Fay Consult Group — Website

Static site for [fayconsultgroup.com](https://fayconsultgroup.com), hosted on GitHub Pages.
Positioning: **speed to lead** for local small and mid-size service businesses, with AI voice
assistants and AI automation as add-ons.

---

## File Structure

```
├── index.html              # Home: speed-to-lead pitch, proof, CTA
├── speed-to-lead.html      # Main offer: sources, features, compliance, onboarding, ROI calc, FAQ (no pricing, by choice)
├── who-its-for.html        # Who it's for + industry cards + service area
├── voice-assistants.html   # Anna (AI voice receptionist) add-on
├── automation.html         # AI automation & audit
├── about.html              # Evan
├── contact.html            # Free response-time test form + booking
├── privacy.html            # Privacy policy (draft, includes SMS language)
├── terms.html              # Website terms + SMS terms (draft)
├── 404.html                # GitHub Pages not-found page
├── services.html           # Redirect -> speed-to-lead.html (old URL)
├── aivoice.html            # Redirect -> voice-assistants.html (old URL)
├── discovery/law-firm.html # Client discovery form (unchanged, not indexed)
├── sitemap.xml, robots.txt
├── css/styles.css          # All shared styles (section 20 = speed-to-lead components)
├── js/main.js              # Nav, animations, ROI calculator, form submit, analytics events
├── js/industries.js        # Industry cards data: edit this to add/remove industries
├── google-apps-script/     # form-handler.gs: Google Sheet + email backend for the contact form
├── images/                 # logo-sm.png (nav/favicon), og-logo.png (social), evan.jpg (About)
└── CNAME
```

Nav and footer are repeated in every page. If you change them, change them on every page.

**Analytics (GA4 `G-CNHFNSK25P`):** any element with `data-track="name"` sends a `cta_click`
event; a successful test-form submit sends `generate_lead`.

---

## Before Going Live — Open Items

Search the HTML for `TODO(Evan)` to find these.

| # | What | Where |
|---|------|-------|
| 1 | **Form backend:** connected to the Google Sheet + Apps Script. After going live, send one real test from a phone and from a desktop browser. | `js/main.js` |
| 2 | **Legal review:** privacy policy and SMS terms are plain-language drafts. Review before A2P 10DLC registration. | `privacy.html`, `terms.html` |
| 3 | **Stats:** the problem section uses soft wording on purpose. Source any hard numbers before adding them. | `index.html` problem section |

Decided (Nov 2026): no pricing on the site; month-to-month, cancel anytime; service area PA/DE/NJ
(no MD), remote setup OK; street address public; no phone number on the site; no employer names;
integrations described as "the major tools"; free 15-minute mini audit plus a paid full audit;
Anna demo line stays (set up as a plumbing company); anna.fayconsultgroup.com is retired in favor
of `voice-assistants.html`.

---

## Form Backend: Google Sheet + Apps Script

The free response-time test form sends to a Google Apps Script web app that:
adds the lead to a Google Sheet, emails you an alert (hit Reply to answer the lead), and sends
the lead an instant "got it" email from your account. Free, with no submission cap beyond
Google's daily email limits.

**One-time setup (about 5 minutes), signed in as evan@fayconsultgroup.com:**

1. Create a new Google Sheet named **Website Leads**.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste in all of
   `google-apps-script/form-handler.gs`, and click **Save**.
3. In the function dropdown at the top, pick **testSetup** and click **Run**. Approve the
   permissions prompt (choose your account → Advanced → Go to project → Allow). You should get
   two test emails, and a **Leads** tab appears with one test row. Delete that row.
4. Click **Deploy → New deployment**. Click the gear icon → **Web app**. Set
   **Execute as: Me** and **Who has access: Anyone**. Click **Deploy** and copy the
   **Web app URL** (ends in `/exec`).
5. Paste that URL into `APPS_SCRIPT_URL` near the top of section 9 in `js/main.js`, then
   commit and push. (Or send it to Claude to do.)

**Changing the script later:** edit it in Apps Script, then **Deploy → Manage deployments →
pencil icon → Version: New version → Deploy**. The URL stays the same.

To change the auto-reply wording or the alert address, edit the settings at the top of the script.

---

## Step 1 — Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name the repo (e.g. `fay-consult-site` or your GitHub username if using `username.github.io`)
3. Set it to **Public**
4. Do **not** initialize with a README (you already have one)
5. Click **Create repository**

---

## Step 2 — Push Files to GitHub

Open a terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Initial site build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repo name.

---

## Step 3 — Enable GitHub Pages

1. In your GitHub repo, go to **Settings → Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Set branch to `main`, folder to `/ (root)`
4. Click **Save**
5. GitHub will show a URL like `https://your-username.github.io/your-repo/` — the site will be live here within ~60 seconds

---

## Step 4 — Point Your Namecheap Domain to GitHub Pages

### Add GitHub's A Records (Apex domain)

In Namecheap → **Domain List → Manage → Advanced DNS**, add these **A Records**:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | `@` | `185.199.108.153` | Automatic |
| A Record | `@` | `185.199.109.153` | Automatic |
| A Record | `@` | `185.199.110.153` | Automatic |
| A Record | `@` | `185.199.111.153` | Automatic |

### Add a CNAME Record (www subdomain)

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME Record | `www` | `YOUR_USERNAME.github.io` | Automatic |

Replace `YOUR_USERNAME` with your GitHub username.

### Set the Custom Domain in GitHub Pages

1. Go back to **Settings → Pages** in your GitHub repo
2. Under **Custom domain**, enter `fayconsultgroup.com`
3. Click **Save**
4. Check **Enforce HTTPS** once the DNS has propagated (can take 5–30 minutes, sometimes up to 24 hrs)

### Verify

Once DNS propagates, visit `https://fayconsultgroup.com` — you should see the site with a valid SSL certificate.

---

## Making Updates

After any edits, push to GitHub and the site will redeploy automatically within ~30 seconds:

```bash
git add .
git commit -m "Update copy on homepage"
git push
```

---

## Dependencies (CDN — no install needed)

- **Google Fonts** — Manrope + DM Sans
- **Lucide icons** (pinned, unpkg)
- **Google Analytics** (GA4)

All animations, interactions, and layout are pure HTML/CSS/vanilla JS.
