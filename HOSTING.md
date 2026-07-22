# Hosting & letting others edit (beginner guide)

The whole site is static files, so the easiest setup is **GitHub + GitHub Pages**:
GitHub hosts the site for free *and* lets trusted people edit it in the browser.
No coding tools needed for edits.

---

## A. Put it online with GitHub Pages (recommended)

1. **Make a free GitHub account** → https://github.com/signup
2. **Create a repository**: click **+** (top right) → *New repository*.
   - Name it e.g. `tunicate-portal`. Choose **Public**. Don't add anything else. → *Create*.
3. **Upload the project files**. Easiest without tools:
   - On the new repo page, click **uploading an existing file**.
   - Drag in the whole project folder's contents (the `public/` folder, `.github/`,
     `README.md`, etc.). **Do not upload** `SupplementaryMaterial_1_260409.xlsx`
     (it's private).
   - Click **Commit changes**.
   - (Or, if you use the command line, see section C.)
4. **Turn on Pages**: repo **Settings** → **Pages** (left menu) → under *Build and
   deployment*, set **Source = "GitHub Actions"**. Done.
   - The included workflow (`.github/workflows/pages.yml`) publishes the `public/`
     folder automatically. First deploy takes ~1 minute (watch the **Actions** tab).
5. Your site is live at **`https://<your-username>.github.io/tunicate-portal/`**.

Every time anyone commits a change, the site re-deploys automatically.

---

## B. Let other people edit

**For a few trusted people (simplest):** add them as collaborators —
repo **Settings → Collaborators → Add people** (they need a GitHub account).
They can then edit any file, including **directly in the browser**:

> Open the file on github.com (e.g. `public/assets/js/genomes-data.js`) → click the
> **pencil ✏️ icon** → edit → **Commit changes**. The site updates itself.

**For open contributions from anyone:** people click **Fork**, edit their copy, and
open a **Pull Request**; you review and click **Merge**. Nothing goes live until you
approve it. Good if you want a public "anyone can propose changes" model.

Most genome updates only touch one file — `public/assets/js/genomes-data.js` — so
browser editing is very approachable. See `UPDATING.md` for what to edit.

---

## C. Command-line upload (optional, if you prefer)

```bash
cd /path/to/TunicatePortal
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/tunicate-portal.git
git push -u origin main
```

(`SupplementaryMaterial_1_260409.xlsx` is already in `.gitignore`, so it won't be
uploaded.)

---

## D. If you'd rather use your own server

The site is just static files — copy the **contents of `public/`** to your web
server's public directory and it works (no build, no Node needed). You can still use
GitHub for collaboration and copy `public/` over whenever it changes (or set up
auto-deploy later). GitHub Pages is simpler, though, and free.

---

### Custom domain (optional, later)
GitHub Pages supports your own domain (e.g. `tunicates.example.org`): Settings → Pages
→ Custom domain. Ask for help when you get there.
