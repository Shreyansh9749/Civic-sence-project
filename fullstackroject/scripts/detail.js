document.addEventListener('DOMContentLoaded', () => {
  const notif = document.getElementById("notification-container");
  const container = document.getElementById("report-details-container");
  const API_URL = "http://localhost:8080/api/reports";

  function toast(msg, type = "success") {
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = msg;
    notif.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => el.remove(), 4000);
  }

  // Get report ID from URL
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get("id");
  if (!reportId) {
    container.innerHTML = "<p>Invalid report ID</p>";
    return;
  }

  async function fetchReport() {
    try {
      const res = await fetch(`${API_URL}/${reportId}`);
      if (!res.ok) throw new Error("Failed to fetch report details");
      const report = await res.json();
      renderReport(report);
    } catch (err) {
      toast(err.message, "error");
      container.innerHTML = `<p class="error-msg">Unable to load report details.</p>`;
    }
  }

  function renderReport(report) {
    container.innerHTML = `
      <div class="issue-item">
        <div class="issue-item-header">
          <h3>${report.category}</h3>
          <span class="issue-item-status ${report.status.toLowerCase()}">${report.status}</span>
        </div>
        <p><strong>Reporter:</strong> ${report.reporterName} (${report.reporterEmail})</p>
        <p><strong>Address:</strong> ${report.street}, ${report.city} (${report.pincode})</p>
        <p><strong>Description:</strong> ${report.description || "No description provided."}</p>

        <div id="report-images" class="report-images">
          ${report.fileData && report.fileData.length ? report.fileData.map(f => `<img src="data:image/*;base64,${f}" alt="Report Image">`).join("") : "<p>No images attached.</p>"}
        </div>

        <div id="map" style="width:100%;height:400px;border-radius:0.75rem;margin-top:1rem;"></div>
      </div>
    `;

    // Initialize Google Map
    if (report.latitude && report.longitude) {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: report.latitude, lng: report.longitude },
        zoom: 15
      });
      new google.maps.Marker({
        position: { lat: report.latitude, lng: report.longitude },
        map,
        title: report.category
      });
    } else {
      document.getElementById("map").innerHTML = "<p>Location not available</p>";
    }
  }

  fetchReport();
});
