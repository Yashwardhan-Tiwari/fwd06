// ===== register.js : "Register Your Parcel" page (student side) =====

// ---------- Form 1: student registers a parcel and shares an OTP ----------

// "Generate OTP" button fills the OTP box with a random 6-digit code
document.getElementById("generate-otp-btn").addEventListener("click", function () {
    document.getElementById("r-otp").value = generateOtp();
});

document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();   // stop the page from reloading

    const button = document.getElementById("register-btn");
    button.disabled = true;
    button.textContent = "Saving...";

    // 1. read the form
    const parcels = getList("parcels");
    const parcel = {
        id: generateId("CP", parcels),
        rollNo: getValue("r-roll").toUpperCase(),
        email: getValue("r-email"),
        courier: getValue("r-courier"),
        otp: getValue("r-otp"),
        instructions: getValue("r-instructions"),
        storage: "Not stored yet",
        status: "Expected",            // parcel has not reached the gate yet
        createdAt: nowText(),
        receivedAt: ""
    };

    // 2. save it
    parcels.push(parcel);
    saveList("parcels", parcels);

    // 3. email the student their Parcel ID and OTP
    const text = "Hello " + parcel.rollNo + ",\n\n" +
        "Your parcel from " + parcel.courier + " is registered.\n" +
        "Parcel ID: " + parcel.id + "\n" +
        "OTP: " + parcel.otp + "\n\n" +
        "Share this OTP with the guard only when you collect the parcel.\n- CampusParcel";
    const sent = await sendEmail(parcel.email, "CampusParcel: Parcel " + parcel.id + " registered", text);

    // 4. tell the user what happened
    const type = sent ? "success" : "warning";
    showMessage("register-message",
        "Parcel registered! Your Parcel ID is " + parcel.id + ". " + otpEmailText(sent, parcel.email, parcel.otp),
        type);

    document.getElementById("register-form").reset();
    button.disabled = false;
    button.textContent = "Register & Share OTP";
});

// ---------- Form 2: parcel coming from a friend or family member ----------

document.getElementById("family-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const button = document.getElementById("family-btn");
    button.disabled = true;
    button.textContent = "Saving...";

    const parcels = getList("parcels");
    const parcel = {
        id: generateId("CP", parcels),
        rollNo: getValue("f-roll").toUpperCase(),
        email: getValue("f-email"),
        courier: "From " + getValue("f-name") + " (" + getValue("f-phone") + ")",
        otp: generateOtp(),            // OTP is made automatically here
        instructions: getValue("f-instructions"),
        storage: "Not stored yet",
        status: "Expected",
        createdAt: nowText(),
        receivedAt: ""
    };

    parcels.push(parcel);
    saveList("parcels", parcels);

    const text = "Hello " + parcel.rollNo + ",\n\n" +
        "A parcel is coming for you " + parcel.courier + ".\n" +
        "Parcel ID: " + parcel.id + "\n" +
        "OTP: " + parcel.otp + "\n\n" +
        "Show this OTP to the guard when you collect it.\n- CampusParcel";
    const sent = await sendEmail(parcel.email, "CampusParcel: Parcel " + parcel.id + " is on its way", text);

    const type = sent ? "success" : "warning";
    showMessage("family-message",
        "Details saved! Your Parcel ID is " + parcel.id + ". " + otpEmailText(sent, parcel.email, parcel.otp),
        type);

    document.getElementById("family-form").reset();
    button.disabled = false;
    button.textContent = "Submit";
});
