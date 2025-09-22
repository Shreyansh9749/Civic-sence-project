document.addEventListener('DOMContentLoaded', () => {
  const API_URL = "http://localhost:8080/api/reports";
  const container = document.getElementById("admin-issues-list-container");
  const notif = document.getElementById("notification-container");
 document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  function toast(msg, type = "success") {
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = msg;
    notif.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => el.remove(), 4000);
  }
  
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.getElementById('theme-icon');

    if(document.body.classList.contains('dark-theme')){
        // Set moon icon with white stroke
        icon.innerHTML = `<path d="M21 12.79A9 9 0 0111.21 3a7 7 0 0011.58 9.79z"></path>`;
        icon.setAttribute('stroke', 'white'); // make it white
        localStorage.setItem('theme', 'dark');
    } else {
        // Set sun icon (default stroke color)
        icon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        icon.setAttribute('stroke', 'currentColor'); // reset color for sun
        localStorage.setItem('theme', 'light');
    }
}



  async function fetchReports(filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append("status", filters.status || "");
      params.append("category", filters.category || "");
      params.append("search", filters.search || "");

      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      const reports = await res.json();
      renderReports(reports);
    } catch (err) {
      toast(err.message, "error");
    }
  }

  function renderReports(reports) {
    container.innerHTML = "";
    if (!reports.length) {
      container.innerHTML = `<p class="no-issues-message">No reports found.</p>`;
      return;
    }

    reports.forEach(report => {
      const card = document.createElement("div");
      card.className = "issue-item";
      const statusClass = report.status ? report.status.toLowerCase() : "submitted";

      card.innerHTML = `
        <div class="issue-item-header">
          <h3>${report.category}</h3>
          <span class="issue-item-status ${statusClass}">${report.status || "Submitted"}</span>
        </div>
        <p class="issue-item-address">📍 ${report.street}, ${report.city} (${report.pincode})</p>
        <p><strong>Reporter:</strong> ${report.reporterName} (${report.reporterEmail})</p>
        <p>${report.description || "No description provided."}</p>
        <div class="report-actions">
          <button class="status-btn" data-id="${report.id}">Change Status</button>
          <button class="delete-btn" data-id="${report.id}">Delete</button>
          <button class="view-btn" data-id="${report.id}">View Details</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Status update
    document.querySelectorAll(".status-btn").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.getAttribute("data-id");
        const newStatus = prompt("Enter new status (Submitted/In-Progress/Resolved):");
        if (!newStatus || !["submitted", "in-progress", "resolved"].includes(newStatus.toLowerCase())) {
          toast("Invalid status", "error");
          return;
        }
        try {
          const res = await fetch(`${API_URL}/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
          });
          if (!res.ok) throw new Error("Status update failed");
          toast("Status updated successfully");
          fetchReports();
        } catch (err) {
          toast(err.message, "error");
        }
      });
    });

    // Delete
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.getAttribute("data-id");
        if (!confirm("Are you sure you want to delete this report?")) return;
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Delete failed");
          toast("Report deleted successfully");
          fetchReports();
        } catch (err) {
          toast(err.message, "error");
        }
      });
    });

    // View Details
    document.querySelectorAll(".view-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.getAttribute("data-id");
        window.location.href = `admindetail.html?id=${id}`;
      });
    });
  }

  // Filters
  document.getElementById("filter-btn").addEventListener("click", () => {
    const status = document.getElementById("filter-status").value;
    const category = document.getElementById("filter-category").value;
    const search = document.getElementById("search-reporter").value.trim();
    fetchReports({ status, category, search });
  });

  fetchReports();
});
