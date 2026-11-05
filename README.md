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
├── images/                 # logo-sm.png (nav/favicon), og-logo.png (social), evan.jpg (About)
└── CNAME
```

Nav and footer are repeated in every page. If you change them, change them on every page.

**Analytics (GA4 `G-CNHFNSK25P`):** any element with `data-track="name"` sends a `cta_click`
event; a successful test-form submit sends `generate_lead`.

---

## Before Going Live — Open Items

Every item is also marked in the HTML with a `TODO(Evan)` comment. Search for `TODO(Evan)`.
Visible placeholders on the page are in `[brackets]`.

| # | What | Where |
|---|------|-------|
| 1 | **Cancellation / term:** state month-to-month vs. minimum term, if you want it on the site (pricing itself stays off the site) | `speed-to-lead.html` FAQ "Can I cancel?" |
| 2 | **Response-time test results:** `[N]`, `[X]`, `[Y]%`, `[industries]` (real, anonymized) | `index.html` proof block |
| 3 | **Stats:** problem section uses soft wording on purpose. Source any hard numbers before adding them. | `index.html` problem section |
| 4 | **Service area:** is Maryland included? OK to advertise remote setup across PA/DE/NJ? | `who-its-for.html`, footer, `index.html` strip, schema in `<head>` |
| 5 | **Integrations:** which are supported at launch (none are named on the site yet) | `speed-to-lead.html` "Do I need new software?" |
| 6 | **AI audit:** free mini-audit or paid, and format | `automation.html` |
| 7 | **Form backend:** currently Formspree `mnjoeolv` (the old contact form's endpoint). Confirm or swap. | `contact.html` form `action` + `FORM_ENDPOINT` in `js/main.js` |
| 8 | **Booking:** Google Calendar link `calendar.app.google/FocAjrRYRFWKcmJGA` (from the old site). Confirm it still works; optional inline embed. | All "Book a call" buttons |
| 9 | **Voice demo:** confirm demo line (610) 884-6159 is live; add `audio/anna-sample-call.mp3` and uncomment the `<audio>` block | `voice-assistants.html` |
| 10 | **anna.fayconsultgroup.com:** link to it, fold it in, or leave separate | `voice-assistants.html` |
| 11 | **Headshot:** using a compressed copy of the existing photo (`images/evan.jpg`) | `about.html` |
| 12 | **Street address** (140 Church St): show publicly or not. Currently only "Phoenixville, PA". | Footer, schema |
| 13 | **Business phone** for click-to-call (none on the site yet) | `contact.html`, sticky mobile bar |
| 14 | **Legal review:** privacy policy and SMS terms are plain-language drafts. Review before A2P 10DLC registration. | `privacy.html`, `terms.html` |
| 15 | **Employer names:** About page says "freight logistics" and "a manufacturer" without naming companies. Name them only if you want to. | `about.html` |

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
