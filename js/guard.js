// ===== guard.js : "Guard Panel" page =====

// ---------- Action 1: guard registers a parcel that has reached the gate ----------

document.getElementById("guard-register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const button = document.getElementById("guard-register-btn");
    button.disabled = true;
    button.textContent = "Saving...";

    // 1. read the form
    const rollNo = getValue("g-roll").toUpperCase();
    const email = getValue("g-email");
    const courier = getValue("g-courier");
    const storage = getValue("g-storage");

    // Photos: we only keep the file name (photos are too big for localStorage)
    const agentFile = document.getElementById("g-agent-photo").files[0];
    const shelfFile = document.getElementById("g-shelf-photo").files[0];
    const agentPhoto = agentFile ? agentFile.name : "Not attached";
    const shelfPhoto = shelfFile ? shelfFile.name : "Not attached";

    const parcels = getList("parcels");

    // 2. did this student already register this parcel on the "Register" page?
    //    If yes, update that parcel. If not, create a new one.
    let parcel = parcels.find(function (p) {
        return p.rollNo === rollNo && p.status === "Expected";
    });

    if (parcel) {
        parcel.status = "At Main Gate";
        parcel.courier = courier;
        parcel.storage = storage;
        parcel.email = email;
        parcel.receivedAt = nowText();
        parcel.agentPhoto = agentPhoto;
        parcel.shelfPhoto = shelfPhoto;
    } else {
        parcel = {
            id: generateId("CP", parcels),
            rollNo: rollNo,
            email: email,
            courier: courier,
            otp: generateOtp(),        // new OTP for this parcel
            instructions: "",
            storage: storage,
            status: "At Main Gate",
            createdAt: nowText(),
            receivedAt: nowText(),
            agentPhoto: agentPhoto,
            shelfPhoto: shelfPhoto
        };
        parcels.push(parcel);
    }
    saveList("parcels", parcels);

    // 3. email the student
    const text = "Hello " + rollNo + ",\n\n" +
        "Your parcel from " + courier + " has reached the main gate.\n" +
        "Parcel ID: " + parcel.id + "\n" +
        "Stored at: " + storage + "\n" +
        "OTP: " + parcel.otp + "\n\n" +
        "Show this OTP to the guard to collect it.\n- CampusParcel";
    const sent = await sendEmail(email, "CampusParcel: Parcel " + parcel.id + " has arrived", text);

    // 4. show the result (the OTP is only shown on screen if email failed)
    const type = sent ? "success" : "warning";
    showMessage("guard-register-message",
        "Parcel " + parcel.id + " registered. " + otpEmailText(sent, email, parcel.otp),
        type);

    document.getElementById("guard-register-form").reset();
    button.disabled = false;
    button.textContent = "Register & Send OTP";
});

// ---------- Action 2: guard checks the OTP and hands over the parcel ----------

document.getElementById("verify-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const parcelId = cleanParcelId(getValue("v-parcel-id"));
    const otp = getValue("v-otp");

    const parcels = getList("parcels");
    const parcel = parcels.find(function (p) {
        return p.id === parcelId;
    });

    // Check things one by one and stop at the first problem
    if (!parcel) {
        showMessage("verify-message", "No parcel found with ID " + parcelId + ".", "error");
        return;
    }
    if (parcel.status === "Collected") {
        showMessage("verify-message", "Parcel " + parcelId + " was already collected on " + parcel.collectedAt + ".", "error");
        return;
    }
    if (parcel.status === "Expected") {
        showMessage("verify-message", "Parcel " + parcelId + " has not been registered at the gate yet.", "error");
        return;
    }
    if (parcel.otp !== otp) {
        showMessage("verify-message", "Wrong OTP. Parcel NOT handed over.", "error");
        return;
    }

    // everything is correct -> mark as collected
    parcel.status = "Collected";
    parcel.collectedAt = nowText();
    saveList("parcels", parcels);

    showMessage("verify-message",
        "OTP verified. Parcel " + parcelId + " handed over to " + parcel.rollNo + ".",
        "success");
    document.getElementById("verify-form").reset();
});
