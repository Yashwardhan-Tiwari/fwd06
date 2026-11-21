// ===== guard-login.js : simple PIN lock for the Guard Panel =====
// The PIN is set in js/config.js (GUARD_PIN).
// sessionStorage remembers the login until the browser tab is closed.

const lockBox = document.getElementById("guard-lock");
const contentBox = document.getElementById("guard-content");

// Hides the PIN screen and shows the real Guard Panel
function openGuardPanel() {
    lockBox.style.display = "none";
    contentBox.style.display = "block";
}

// Already logged in during this visit?
if (sessionStorage.getItem("guardOpen") === "yes") {
    openGuardPanel();
}

// When the guard presses "Open Guard Panel"
document.getElementById("pin-form").addEventListener("submit", function (event) {
    event.preventDefault();
    if (getValue("pin-input") === GUARD_PIN) {
        sessionStorage.setItem("guardOpen", "yes");
        openGuardPanel();
    } else {
        showMessage("pin-message", "Wrong PIN. Try again.", "error");
        document.getElementById("pin-form").reset();
    }
});

// "Lock" button in the header
document.getElementById("guard-logout").addEventListener("click", function () {
    sessionStorage.removeItem("guardOpen");
    window.location.reload();
});
