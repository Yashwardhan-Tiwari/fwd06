# CampusParcel

A simple website for **secure parcel collection at South Asian University**.
A guard registers a parcel, the student gets a 6-digit **OTP** by email, and the parcel is handed over only when the OTP matches.

Built with plain **HTML, CSS and JavaScript** (no frameworks, no backend).

## If you see no colours / the buttons do nothing
The page is looking for the `css/` and `js/` folders **next to** `index.html`. This breaks if you:
- open `index.html` from **inside the zip** (right-click the zip -> **Extract All** first), or
- copy `index.html` out of the folder on its own, or
- upload only the HTML files to GitHub / hosting (upload the whole folder structure).

## Folder structure

```
index.html            <- home / dashboard (main entry file)
pages/                <- all other pages
    register.html
    my-parcel.html
    guard-panel.html
    support.html
css/                  <- stylesheets
    style.css  header.css  footer.css
js/                   <- JavaScript
    config.js         (email keys - the only file you edit)
    main.js           (shared helpers: storage, OTP, email)
    register.js  guard-login.js  guard.js  my-parcel.js  support.js   (one per page)
images/               <- South Asian University pictures
```

## Guard Panel is separate
The Guard Panel is **not in the main menu**. Guards open it from the small **Guard login** link in the footer, then type the PIN (default `1234`, change it in `js/config.js`). It has its own header with a **Back to main site** link and a **Lock** button.
This PIN is a simple front-end lock for the project, not real security.

## How the features work

| Feature | Where it is |
|---|---|
| OTP / code generator | `generateOtp()` in `js/main.js` (random 6 digits) and the **Generate** button in `js/register.js` |
| Parcel ID generator | `generateId()` in `js/main.js` (e.g. `#CP-4821`) |
| Saving data | `getList()` / `saveList()` in `js/main.js` (browser `localStorage`) |
| Email sending | `sendEmail()` in `js/main.js` (uses EmailJS) |
| Register parcel (student) | `js/register.js` |
| Guard PIN lock | `js/guard-login.js` (PIN is `GUARD_PIN` in `js/config.js`, default `1234`) |
| Receive parcel + verify OTP (guard) | `js/guard.js` |
| See my parcels and OTP | `js/my-parcel.js` |
| Complaints and feedback | `js/support.js` |

### The flow
1. **Register Your Parcel** - student fills the form (or clicks *Generate* for an OTP). A Parcel ID is created and an email is sent.
2. **Guard Panel -> Register Collecting Parcel** - guard enters the student's roll number and shelf. If the student pre-registered, that parcel is updated to "At Main Gate"; otherwise a new parcel and OTP are created. The student is emailed.
3. **Guard Panel -> Verify & Handover** - guard enters Parcel ID + OTP. The code checks: parcel exists -> not already collected -> has reached the gate -> OTP matches. Then it is marked **Collected**.
4. **My Parcels** - student enters their roll number to see status and OTP.

## Turn on real email sending (5 minutes, free)

Until you do this the site runs in **demo mode**: everything works, but the OTP is shown on the screen instead of being emailed.

1. Create a free account at <https://www.emailjs.com>.
2. **Email Services -> Add New Service** (Gmail is easiest). Copy the **Service ID**.
3. **Email Templates -> Create New Template**. Set:
   - **To Email:** `{{to_email}}`
   - **Subject:** `{{subject}}`
   - **Content:** `{{message}}`

   Save it and copy the **Template ID**.
4. **Account -> General** -> copy your **Public Key**.
5. Open `js/config.js` and replace the three EmailJS values (`publicKey`, `serviceId`, `templateId`). `supportEmail` is already set to yashwardhan1907@gmail.com.
6. Send a test: register a parcel with your own email address.

> The Public Key is designed to be visible in front-end code, so it is fine to push to GitHub.
> In EmailJS you can also restrict it to your website's domain.

## Run it on your computer
Just double-click `index.html`. (Or in VS Code use the *Live Server* extension.)

## Put it on GitHub and host it

1. Create a new **public** repository on GitHub (e.g. `campus-parcel`).
2. Upload everything inside this folder so that `index.html` is in the **root** of the repository.
   Using git:
   ```
   git init
   git add .
   git commit -m "CampusParcel final project"
   git branch -M main
   git remote add origin https://github.com/<your-username>/campus-parcel.git
   git push -u origin main
   ```
3. **GitHub Pages:** repository **Settings -> Pages -> Source: Deploy from a branch -> main / (root) -> Save**.
   Your live link will be `https://<your-username>.github.io/campus-parcel/`.
   - **InfinityFree (alternative):** upload the same folders into the `htdocs` folder so `index.html` sits directly inside `htdocs`.
4. Submit both links: the GitHub repository link and the live site link.

## Good to know
- Data (parcels, complaints) is saved in the **browser's localStorage**, so it is visible only in the same browser on the same device. This is normal for a front-end-only project; a real system would use a server and database.
- Photos on the guard panel are not stored, only their file names (photos are too large for localStorage).
