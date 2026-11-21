// ===== config.js : the ONLY file you need to edit to turn on real emails =====
//
// We use a free service called EmailJS (https://www.emailjs.com) to send emails
// straight from the browser. See README.md for the 5-minute setup.
// Until you paste your own keys below, the site runs in "demo mode":
// everything works, but the OTP is shown on the screen instead of being emailed.

const EMAILJS_CONFIG = {
    publicKey:  "YOUR_PUBLIC_KEY",     // EmailJS -> Account -> General -> Public Key
    serviceId:  "YOUR_SERVICE_ID",     // EmailJS -> Email Services -> Service ID
    templateId: "YOUR_TEMPLATE_ID",    // EmailJS -> Email Templates -> Template ID
    supportEmail: "yashwardhan1907@gmail.com"  // complaints & feedback are emailed here
};

// PIN needed to open the Guard Panel (change it to your own).
// Note: this is a simple front-end lock for the project, not real security.
const GUARD_PIN = "1234";
