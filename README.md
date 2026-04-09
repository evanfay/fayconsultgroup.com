# Fay Consult Group — Website

Static site for [fayconsultgroup.com](https://fayconsultgroup.com), hosted on GitHub Pages.

---

## File Structure

```
fay-consult-site/
├── index.html          # Home / Hero
├── services.html       # Services
├── about.html          # About
├── contact.html        # Contact
├── css/
│   └── styles.css      # All shared styles
├── js/
│   └── main.js         # Scroll animations + nav logic
├── CNAME               # Custom domain for GitHub Pages
└── README.md           # This file
```

---

## Before Going Live — Placeholders to Replace

Search the codebase for these and swap them out before publishing:

| # | What | Where | Replace With |
|---|------|--------|--------------|
| 1 | **Google Calendar link** | `contact.html` — `href` on "Book a Free Discovery Call" button | Your Google Calendar Appointment Scheduling URL |
| 2 | **Formspree form ID** | `contact.html` — `action` on `<form>` tag | `https://formspree.io/f/YOUR_ACTUAL_ID` after signing up at [formspree.io](https://formspree.io) |
| 3 | **Founder photo** | `about.html` — gray placeholder block labeled "Photo Coming Soon" | Replace the `<div class="founder__photo">` block with `<img src="images/evan-fay.jpg" alt="Evan Fay" class="founder__photo-img" />` and add the image to an `/images/` folder |
| 4 | **Stats** | `index.html` — stats strip section (marked with `<!-- Replace placeholder stats -->`) | Real numbers: processes automated, hours saved, companies served |
| 5 | **Copyright year** | Footer on all 4 pages | Update `2025` to current year if needed |

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

- **Google Fonts** — Space Grotesk + Inter
- No other external dependencies

All animations, interactions, and layout are pure HTML/CSS/vanilla JS.
