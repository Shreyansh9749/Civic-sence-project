document.addEventListener('DOMContentLoaded', async () => {
    const reportInfoContainer = document.getElementById('report-info');
    const imageContainer = document.getElementById('report-image-container');
    const mapContainerId = 'report-map-detail';

    // Get report ID from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('id');

    if (!reportId) {
        reportInfoContainer.innerHTML = `<p class="error">No report ID provided.</p>`;
        return;
    }

    try {
        // Fetch the specific report details from the backend
        const response = await fetch(`http://localhost:8080/api/admin/reports/${reportId}`);
        if (!response.ok) {
            throw new Error('Report not found or server error.');
        }
        const report = await response.json();
        const reportWithImageResponse = await fetch(`http://localhost:8080/api/admin/reports/${reportId}`);
        const reportWithImage = await reportWithImageResponse.json();

        // Display text details
        reportInfoContainer.innerHTML = `
            <div class="info-item"><strong>Report ID:</strong> ${report.id}</div>
            <div class="info-item"><strong>Category:</strong> ${report.category}</div>
            <div class="info-item"><strong>Address:</strong> ${[report.street, report.city, report.pincode].join(', ')}</div>
            <div class="info-item"><strong>Reporter:</strong> ${report.reporterEmail}</div>
            <div class="info-item"><strong>Description:</strong> ${report.description || 'N/A'}</div>
        `;

       // Display the image if it exists
const imageUrl = `http://localhost:8080/api/admin/reports/${reportId}/image`;

fetch(imageUrl).then(res => {
    if (res.ok) {
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Attached report image" style="max-width: 100%; border-radius: 8px;">`;
    } else {
        imageContainer.innerHTML = `<p>No image was attached to this report.</p>`;
    }
});

        // Initialize and display the map
        if (report.latitude && report.longitude) {
            const map = L.map(mapContainerId).setView([report.latitude, report.longitude], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.marker([report.latitude, report.longitude]).addTo(map)
                .bindPopup('Reported Location')
                .openPopup();
        }

    } catch (error) {
        console.error('Error loading report details:', error);
        reportInfoContainer.innerHTML = `<p class="error">Failed to load report details. ${error.message}</p>`;
    }
});
