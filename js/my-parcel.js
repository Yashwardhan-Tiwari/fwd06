// ===== my-parcel.js : "My Parcels" page (student side) =====

const form = document.getElementById("find-form");
const tableBody = document.getElementById("parcel-rows");
const detailsBox = document.getElementById("details-message");
let myParcels = [];   // parcels of the student currently shown

// Draws the stat cards and the table for one roll number
function showParcels(rollNo) {
    const all = getList("parcels");
    myParcels = all.filter(function (p) {
        return p.rollNo === rollNo;
    });

    // --- stat cards ---
    const pending = myParcels.filter(function (p) { return p.status !== "Collected"; });
    const collected = myParcels.filter(function (p) { return p.status === "Collected"; });
    document.getElementById("stat-pending").textContent = pending.length;
    document.getElementById("stat-collected").textContent = collected.length;
    // Shelf of the latest parcel that is waiting at the gate
    const atGate = pending.filter(function (p) { return p.status === "At Main Gate"; });
    document.getElementById("stat-shelf").textContent =
        atGate.length > 0 ? atGate[atGate.length - 1].storage : "-";

    // --- table rows ---
    detailsBox.style.display = "none";
    if (myParcels.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No parcels found for ' + escapeHtml(rollNo) + '.</td></tr>';
        return;
    }

    let rows = "";
    myParcels.forEach(function (p, index) {
        const isCollected = p.status === "Collected";
        const statusText = p.status === "Expected" ? "Awaiting Arrival" : p.status;
        const statusClass = isCollected ? "status-success" : "status-pending";
        const button = isCollected
            ? '<button class="btn-secondary" disabled>Collected</button>'
            : '<button class="btn-primary" data-index="' + index + '">View OTP / Details</button>';

        rows += "<tr>" +
            "<td>" + escapeHtml(p.id) + "</td>" +
            "<td>" + escapeHtml(p.courier) + "</td>" +
            "<td>" + escapeHtml(p.receivedAt || "Not arrived yet") + "</td>" +
            "<td>" + escapeHtml(p.storage) + "</td>" +
            '<td><span class="status ' + statusClass + '">' + escapeHtml(statusText) + "</span></td>" +
            "<td>" + button + "</td>" +
            "</tr>";
    });
    tableBody.innerHTML = rows;
}

// When the student presses "Show My Parcels"
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const rollNo = getValue("my-roll").toUpperCase();
    localStorage.setItem("myRoll", rollNo);   // remember it for next visit
    showParcels(rollNo);
});

// When a "View OTP / Details" button inside the table is clicked
tableBody.addEventListener("click", function (event) {
    const index = event.target.getAttribute("data-index");
    if (index === null) {
        return;   // click was not on a details button
    }
    const p = myParcels[index];
    let text = "Parcel " + p.id + " | OTP: " + p.otp + " | Courier: " + p.courier + " | Storage: " + p.storage;
    if (p.instructions) {
        text += " | Instructions: " + p.instructions;
    }
    showMessage("details-message", text, "success");
});

// If the student searched before, show their parcels straight away
const savedRoll = localStorage.getItem("myRoll");
if (savedRoll) {
    document.getElementById("my-roll").value = savedRoll;
    showParcels(savedRoll);
}
