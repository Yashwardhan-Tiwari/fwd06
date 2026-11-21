# CampusParcel

A simple website for **secure parcel collection at South Asian University**.
A guard registers a parcel, the student gets a 6-digit **OTP** by email, and the parcel is handed over only when the OTP matches.

Built with plain **HTML, CSS and JavaScript** (no frameworks, no backend).
\

## Folder structure

```
index.html            <- home / dashboard (main entry file)
README.md
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
The Guard Panel is **not in the main menu**. Guards open it from the small **Guard login** link in the footer, then type the PIN . It has its own header with a **Back to main site** link and a **Lock** button.
This PIN is a simple front-end lock for the project, not real security.

### The flow
1. **Register Your Parcel** - student fills the form (or clicks *Generate* for an OTP). A Parcel ID is created and an email is sent.
2. **Guard Panel -> Register Collecting Parcel** - guard enters the student's roll number and shelf. If the student pre-registered, that parcel is updated to "At Main Gate"; otherwise a new parcel and OTP are created. The student is emailed.
3. **Guard Panel -> Verify & Handover** - guard enters Parcel ID + OTP. The code checks: parcel exists -> not already collected -> has reached the gate -> OTP matches. Then it is marked **Collected**.
4. **My Parcels** - student enters their roll number to see status and OTP.


This is normal for a front-end-only project; a real system would use a server and database.
- Photos on the guard panel are not stored, only their file names (photos are too large for localStorage).
