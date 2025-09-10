// Get report ID from query string (?id=123)
function getReportId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadReport() {
  const id = getReportId();
  if (!id) {
    document.getElementById("report-info").innerHTML =
      "<p style='color:red;'>No report ID provided.</p>";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/admin/reports/${id}`);
    if (!response.ok) throw new Error("Failed to fetch report");

    const report = await response.json();
    const container = document.getElementById("report-info");

    container.innerHTML = `
      <div class="info-item"><strong>ID:</strong> ${report.id}</div>
      <div class="info-item"><strong>Category:</strong> ${report.category}</div>
      <div class="info-item"><strong>City:</strong> ${report.city}</div>
      <div class="info-item"><strong>Street:</strong> ${report.street}</div>
      <div class="info-item"><strong>Description:</strong> ${report.description}</div>
      <div class="info-item"><strong>Reporter Name:</strong> ${report.reporterName}</div>
      <div class="info-item"><strong>Reporter Email:</strong> ${report.reporterEmail}</div>
      <div class="info-item"><strong>Status:</strong> Submitted</div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("report-info").innerHTML =
      "<p style='color:red;'>Error loading report details.</p>";
  }
}

function goBack() {
  window.location.href = "admin-reports.html";
}

// Load details when page is ready
loadReport();
