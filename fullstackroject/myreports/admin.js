// admin-reports.js
// Fetches all reports and renders cards. Clicking View Details or card (outside iframe) opens detail page.

const API_BASE = "http://localhost:8080"; // adjust if backend runs at different host/port
const LIST_ENDPOINT = "/api/admin/reports";

async function loadReports() {
  const container = document.getElementById("reportsContainer");
  container.innerHTML = `<p class="loading">Loading reports...</p>`;

  try {
    const res = await fetch(API_BASE + LIST_ENDPOINT);
    if (!res.ok) throw new Error("Failed to fetch reports: " + res.status);
    const reports = await res.json();
    if (!Array.isArray(reports) || reports.length === 0) {
      container.innerHTML = `<p class="empty">No reports found</p>`;
      return;
    }

    container.innerHTML = ""; // clear
    reports.forEach(report => {
      const card = document.createElement("div");
      card.className = "report-card";
      // compute status class
      const status = (report.status || "SUBMITTED").toString().toLowerCase();
      const statusClass = status.includes("resolv") ? "status-resolved" :
                          status.includes("progress") ? "status-inprogress" : "status-submitted";

      // address line for display (omit lat/lon)
      const address = [report.street, report.landmark, report.city, report.pincode]
                        .filter(Boolean)
                        .join(" • ");

      // media (map if we have lat/long, otherwise photo if fileData)
      let mediaHTML = "";
      if (report.latitude && report.longitude) {
        // embed google maps
        const lat = encodeURIComponent(report.latitude);
        const lng = encodeURIComponent(report.longitude);
        mediaHTML = `<div class="media">
          <iframe
            width="100%" height="100%" frameborder="0" style="border:0"
            src="https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed"
            allowfullscreen
            loading="lazy"></iframe>
        </div>`;
      } else if (report.fileData) {
        mediaHTML = `<div class="media">
          <img src="data:image/jpeg;base64,${report.fileData}" alt="photo" style="width:100%; height:100%; object-fit:cover;">
        </div>`;
      } else {
        mediaHTML = `<div class="media"></div>`;
      }

      card.innerHTML = `
        <div class="card-header">
          <div>
            <div class="issue-title">${escapeHtml(report.category || "Unknown")}</div>
            <div class="issue-meta">${escapeHtml(address || "")}</div>
          </div>
          <div>
            <div class="status-badge ${statusClass}">${(report.status || "SUBMITTED").toUpperCase()}</div>
          </div>
        </div>

        <div class="card-desc">${escapeHtml(report.description || "")}</div>

        ${mediaHTML}

        <div class="card-controls">
          <button class="view-btn">View Details</button>
        </div>

        <!-- overlay used to make card clickable; positioned under actual buttons -->
        <a class="card-link" href="admindetail.html?id=${report.id}" aria-label="Open details for report ${report.id}"></a>
      `;

      // Clicking the View Details button:
      const viewBtn = card.querySelector(".view-btn");
      viewBtn.addEventListener("click", (ev) => {
        // prevent default anchor overlay from interfering; but direct redirect is simplest
        ev.stopPropagation();
        window.location.href = `admindetail.html?id=${report.id}`;
      });

      // Clicking anywhere on card (not iframe) will follow the anchor since overlay link is present.
      // Append card to container
      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="empty">Error loading reports. Check backend and CORS.</p>`;
  }
}

// small helper to avoid XSS injection when rendering text
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("DOMContentLoaded", loadReports);
