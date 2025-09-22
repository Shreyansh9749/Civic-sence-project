// document.addEventListener('DOMContentLoaded', () => {
//   const API_URL = "http://localhost:8080/api/reports";
//   const container = document.getElementById("my-issues-list-container");
//   const notif = document.getElementById("notification-container");

//   const userEmail = localStorage.getItem("civic-reporter-user-email");
//   if (!userEmail) {
//     toast("You must be logged in to view reports", "error");
//     setTimeout(() => { window.location.href = "login.html"; }, 2000);
//     return;
//   }

//   function toast(msg, type = "success") {
//     const el = document.createElement("div");
//     el.className = "toast " + type;
//     el.textContent = msg;
//     notif.appendChild(el);
//     requestAnimationFrame(() => el.classList.add("show"));
//     setTimeout(() => el.remove(), 4000);
//   }

//   async function fetchReports() {
//     try {
//       const res = await fetch(`${API_URL}?reporterEmail=${userEmail}`);
//       if (!res.ok) throw new Error("Failed to fetch reports");

//       const reports = await res.json();
//       renderReports(reports);
//     } catch (err) {
//       toast(err.message, "error");
//     }
//   }

//   function renderReports(reports) {
//     container.innerHTML = "";
//     if (!reports.length) {
//       container.innerHTML = `<p class="no-issues-message">No reports submitted yet.</p>`;
//       return;
//     }

//     reports.forEach(report => {
//       const card = document.createElement("div");
//       card.className = "issue-item";

//       // handle status (if null → Submitted)
//       const status = report.status ? report.status.toLowerCase() : "submitted";

//       card.innerHTML = `
//         <div class="issue-item-header">
//           <h3>${report.category}</h3>
//           <span class="issue-item-status ${status}">
//             ${report.status || "Submitted"}
//           </span>
//         </div>
//         <p class="issue-item-address">
//           📍 ${report.street}, ${report.city} (${report.pincode})
//         </p>
//         <p>${report.description || "No description provided."}</p>

//         <div class="report-actions">
//           <button class="edit-btn" data-id="${report.id}">Edit</button>
//           <button class="delete-btn" data-id="${report.id}">Delete</button>
//         </div>
//       `;

//       container.appendChild(card);
//     });

//     // edit buttons
//     document.querySelectorAll(".edit-btn").forEach(btn =>
//       btn.addEventListener("click", e => {
//         const id = e.target.getAttribute("data-id");
//         // changed to report.html
//         window.location.href = `report.html?id=${id}`;
//       })
//     );

//     // delete buttons
//     document.querySelectorAll(".delete-btn").forEach(btn =>
//       btn.addEventListener("click", async e => {
//         const id = e.target.getAttribute("data-id");
//         if (!confirm("Are you sure you want to delete this report?")) return;

//         try {
//           const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//           if (!res.ok) throw new Error("Delete failed");
//           toast("Report deleted successfully");
//           fetchReports();
//         } catch (err) {
//           toast(err.message, "error");
//         }
//       })
//     );
//   }

//   fetchReports();
// });
// document.addEventListener('DOMContentLoaded', () => {
//   const API_URL = "http://localhost:8080/api/reports";
//   const container = document.getElementById("my-issues-list-container");
//   const notif = document.getElementById("notification-container");

//   const userEmail = localStorage.getItem("civic-reporter-user-email");
//   if (!userEmail) {
//     toast("You must be logged in to view reports", "error");
//     setTimeout(() => { window.location.href = "login.html"; }, 2000);
//     return;
//   }

//   function toast(msg, type = "success") {
//     const el = document.createElement("div");
//     el.className = "toast " + type;
//     el.textContent = msg;
//     notif.appendChild(el);
//     requestAnimationFrame(() => el.classList.add("show"));
//     setTimeout(() => el.remove(), 4000);
//   }

//   async function fetchReports() {
//     try {
//       const res = await fetch(`${API_URL}?reporterEmail=${userEmail}`);
//       if (!res.ok) throw new Error("Failed to fetch reports");

//       const reports = await res.json();
//       renderReports(reports);
//     } catch (err) {
//       toast(err.message, "error");
//     }
//   }

//   function renderReports(reports) {
//     container.innerHTML = "";
//     if (!reports.length) {
//       container.innerHTML = `<p class="no-issues-message">No reports submitted yet.</p>`;
//       return;
//     }

//     reports.forEach(report => {
//       const card = document.createElement("div");
//       card.className = "issue-item";

//       // status fetched from backend (read-only)
//       const status = report.status ? report.status.toLowerCase() : "submitted";

//       card.innerHTML = `
//         <div class="issue-item-header">
//           <h3>${report.category}</h3>
//           <span class="issue-item-status ${status}">
//             ${report.status || "Submitted"}
//           </span>
//         </div>
//         <p class="issue-item-address">
//           📍 ${report.street}, ${report.city} (${report.pincode})
//         </p>
//         <p>${report.description || "No description provided."}</p>

//         <div class="report-actions">
//           <button class="edit-btn" data-id="${report.id}">Edit</button>
//           <button class="delete-btn" data-id="${report.id}">Delete</button>
//         </div>
//       `;

//       container.appendChild(card);
//     });

//     // Edit buttons → redirect to report.html with id
//     document.querySelectorAll(".edit-btn").forEach(btn =>
//       btn.addEventListener("click", e => {
//         const id = e.target.getAttribute("data-id");
//         window.location.href = `report.html?id=${id}`;
//       })
//     );

//     // Delete buttons → call DELETE API
//     document.querySelectorAll(".delete-btn").forEach(btn =>
//       btn.addEventListener("click", async e => {
//         const id = e.target.getAttribute("data-id");
//         if (!confirm("Are you sure you want to delete this report?")) return;

//         try {
//           const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//           if (!res.ok) throw new Error("Delete failed");
//           toast("Report deleted successfully");
//           fetchReports(); // refresh list
//         } catch (err) {
//           toast(err.message, "error");
//         }
//       })
//     );
//   }

//   fetchReports();
// });
document.addEventListener('DOMContentLoaded', () => {
  const API_URL = "http://localhost:8080/api/reports";
  const container = document.getElementById("my-issues-list-container");
  const notif = document.getElementById("notification-container");

  const userEmail = localStorage.getItem("civic-reporter-user-email");
  if (!userEmail) {
    toast("You must be logged in to view reports", "error");
    setTimeout(() => { window.location.href = "login.html"; }, 2000);
    return;
  }

  const filterCategory = document.getElementById("filter-category");
  const filterStatus = document.getElementById("filter-status");
  const filterBtn = document.getElementById("filter-btn");

  function toast(msg, type = "success") {
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = msg;
    notif.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => el.remove(), 4000);
  }

  async function fetchReports(filters = {}) {
    try {
      let query = `?reporterEmail=${userEmail}`;
      if (filters.category) query += `&category=${filters.category}`;
      if (filters.status) query += `&status=${filters.status}`;

      const res = await fetch(`${API_URL}${query}`);
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
      const status = report.status ? report.status.toLowerCase() : "submitted";

      card.innerHTML = `
        <div class="issue-item-header">
          <h3>${report.category}</h3>
          <span class="issue-item-status ${status}">
            ${report.status || "Submitted"}
          </span>
        </div>
        <p class="issue-item-address">📍 ${report.street}, ${report.city} (${report.pincode})</p>
        <p>${report.description || "No description provided."}</p>
        <div class="report-actions">
          <button class="edit-btn" data-id="${report.id}">Edit</button>
          <button class="delete-btn" data-id="${report.id}">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });

    // edit buttons
    document.querySelectorAll(".edit-btn").forEach(btn =>
      btn.addEventListener("click", e => {
        const id = e.target.dataset.id;
        window.location.href = `report.html?id=${id}`;
      })
    );

    // delete buttons
    document.querySelectorAll(".delete-btn").forEach(btn =>
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (!confirm("Are you sure you want to delete this report?")) return;

        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Delete failed");
          toast("Report deleted successfully");
          fetchReports(getFilters());
        } catch (err) {
          toast(err.message, "error");
        }
      })
    );
  }

  function getFilters() {
    return {
      category: filterCategory.value,
      status: filterStatus.value
    };
  }

  // Apply filter
  filterBtn.addEventListener("click", () => fetchReports(getFilters()));

  // Initial fetch
  fetchReports();
});
