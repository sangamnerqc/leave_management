// 🔗 IMPORTANT: Replace this
const API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";

// 🔐 Google Login
function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  const email = data.email;

  if (!email.endsWith("@college.edu")) {
    alert("Use institutional email only");
    return;
  }

  localStorage.setItem("userEmail", email);

  document.getElementById("userEmail").innerText = email;
  document.getElementById("email").value = email;

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("appSection").style.display = "block";
}

// 🔍 Decode JWT
function parseJwt(token) {
  return JSON.parse(atob(token.split('.')[1]));
}

// 📝 Submit Leave
document.getElementById("leaveForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    from: document.getElementById("from").value,
    to: document.getElementById("to").value,
    className: document.getElementById("className").value,
    lectureTime: document.getElementById("lectureTime").value,
    adjustTo: document.getElementById("adjustTo").value,
    reason: document.getElementById("reason").value
  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(() => {
    alert("Leave submitted successfully!");
    document.getElementById("leaveForm").reset();
    document.getElementById("email").value = localStorage.getItem("userEmail");
  })
  .catch(() => {
    alert("Error submitting leave");
  });
});

// 📊 Track Status
function trackStatus() {
  const email = localStorage.getItem("userEmail");

  fetch(API_URL + "?email=" + email)
    .then(res => res.json())
    .then(data => {

      let output = "";

      if (data.length === 0) {
        output = "No leave records found";
      } else {
        data.forEach(l => {
          output += `
            <div>
              <b>${l.from} to ${l.to}</b><br>
              Status: ${l.status}<br>
              Adjustment: ${l.adjustment}<br>
              Assigned To: ${l.adjustTo}<br>
              <a href="${l.link}" target="_blank">View Document</a>
              <hr>
            </div>
          `;
        });
      }

      document.getElementById("status").innerHTML = output;
    })
    .catch(() => {
      document.getElementById("status").innerText = "Error loading data";
    });
}

// 🔄 Auto Login
window.onload = function() {
  const email = localStorage.getItem("userEmail");

  if (email) {
    document.getElementById("userEmail").innerText = email;
    document.getElementById("email").value = email;

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
  }
};
