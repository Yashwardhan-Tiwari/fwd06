// ===== main.js : small helper functions used by every page =====

// ---------- 1. Storage ----------
// The browser's localStorage works like a tiny database.
// We save each list (parcels, complaints, feedback) as text using JSON.

function getList(key) {
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);   // text -> array
    }
    return [];                      // nothing saved yet
}

function saveList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));   // array -> text
}

// ---------- 2. Code / OTP generators ----------

// Makes a random 6-digit OTP, e.g. "482913"
function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

// Makes an ID like "#CP-4821" that is not already used in the list
function generateId(prefix, list) {
    let id;
    let alreadyUsed = true;
    while (alreadyUsed) {
        id = "#" + prefix + "-" + Math.floor(1000 + Math.random() * 9000);
        alreadyUsed = list.some(function (item) {
            return item.id === id;
        });
    }
    return id;
}

// Lets the user type "cp-9021" and still match "#CP-9021"
function cleanParcelId(text) {
    let id = text.trim().toUpperCase();
    if (id.charAt(0) !== "#") {
        id = "#" + id;
    }
    return id;
}

// ---------- 3. Small utilities ----------

// Reads an input box and removes extra spaces
function getValue(id) {
    return document.getElementById(id).value.trim();
}

// Current date and time as readable text
function nowText() {
    return new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

// Makes text safe before placing it inside HTML (stops people typing <script>)
function escapeHtml(text) {
    const temp = document.createElement("div");
    temp.textContent = text;
    return temp.innerHTML;
}

// Shows a coloured message box. type = "success", "warning" or "error"
function showMessage(boxId, text, type) {
    const box = document.getElementById(boxId);
    box.className = "message " + type;
    box.textContent = text;
    box.style.display = "block";
}

// ---------- 4. Email sending (EmailJS) ----------

// true only when the keys in config.js have been replaced with real ones
function emailIsConfigured() {
    return EMAILJS_CONFIG.publicKey.indexOf("YOUR_") !== 0 &&
           EMAILJS_CONFIG.serviceId.indexOf("YOUR_") !== 0 &&
           EMAILJS_CONFIG.templateId.indexOf("YOUR_") !== 0;
}

// Sends one email. Returns true if it was sent, false if not.
// "async/await" just means: wait here until the internet request finishes.
async function sendEmail(toEmail, subject, message) {
    if (!emailIsConfigured()) {
        return false;   // demo mode
    }

    try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: EMAILJS_CONFIG.serviceId,
                template_id: EMAILJS_CONFIG.templateId,
                user_id: EMAILJS_CONFIG.publicKey,
                template_params: {
                    to_email: toEmail,
                    subject: subject,
                    message: message
                }
            })
        });
        return response.ok;
    } catch (error) {
        return false;   // no internet or EmailJS refused
    }
}

// Text shown to the user after we try to send an OTP email
function otpEmailText(sent, toEmail, otp) {
    if (sent) {
        return "An email with the OTP was sent to " + toEmail + ".";
    }
    return "Email was not sent (EmailJS is not set up or failed - see README). The OTP is: " + otp;
}
