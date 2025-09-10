async function fetchReports() {
  const container = document.getElementById("reportsContainer");
  container.innerHTML = `<p class="loading">Loading reports...</p>`;

  try {
    const response = await fetch("http://localhost:8080/api/admin/reports");
    if (!response.ok) throw new Error("Failed to fetch reports");

    const reports = await response.json();
    container.innerHTML = "";

    if (reports.length === 0) {
      container.innerHTML = `<p class="loading">No reports found</p>`;
      return;
    }

    reports.forEach(report => {
      const card = document.createElement("div");
      card.classList.add("report-card");

      card.innerHTML = `
        <h3>${report.category || "Unknown Issue"}</h3>
        <p class="address">${report.street || ""}, ${report.city || ""} - ${report.pincode || ""}</p>
        <p class="description">${report.description || ""}</p>
        <span class="status ${report.status?.toLowerCase() || "submitted"}">
          ${report.status || "SUBMITTED"}
        </span>
        <div class="map">
          <iframe
            width="100%"
            height="100%"
            frameborder="0" style="border:0"
            src="https://www.google.com/maps?q=${report.latitude},${report.longitude}&hl=en&z=15&output=embed"
            allowfullscreen>
          </iframe>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="loading">Error loading reports</p>`;
  }
}

// Dummy navigation functions
function goHome() {
  alert("Go Home clicked (hook this to your Home page)");
}

function adminView() {
  alert("Already in Admin View");
}

window.onload = fetchReports;
