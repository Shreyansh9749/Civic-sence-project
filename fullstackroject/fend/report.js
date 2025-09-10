document.addEventListener('DOMContentLoaded', () => {
    let reportMap;
    let locationMarker;

    const notificationContainer = document.getElementById('notification-container');
    function showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        if(notificationContainer) notificationContainer.appendChild(toast);
        requestAnimationFrame(() => { toast.classList.add('show'); });
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 5000);
    }

    function applyTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }

    function initializeReportMap() {
        if (reportMap) return;
        try {
            reportMap = L.map('report-map').setView([23.16, 79.93], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(reportMap);
            
            locationMarker = L.marker(reportMap.getCenter(), { draggable: true }).addTo(reportMap);
            updateCoordsFromMarker(locationMarker.getLatLng());

            locationMarker.on('dragend', (e) => updateCoordsFromMarker(e.target.getLatLng()));
            reportMap.on('click', (e) => {
                locationMarker.setLatLng(e.latlng);
                updateCoordsFromMarker(e.latlng);
            });

            setTimeout(() => reportMap.invalidateSize(), 10);
        } catch (error) {
            console.error("Report map initialization failed:", error);
            document.getElementById('report-map').innerHTML = `<p style="color:red">Failed to load map.</p>`;
        }
    }

    async function updateCoordsFromMarker(latLng) {
        document.getElementById('latitude').value = latLng.lat;
        document.getElementById('longitude').value = latLng.lng;
        
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.lat}&lon=${latLng.lng}`);
            const data = await response.json();
            if (data && data.address) {
                const addr = data.address;
                document.getElementById('street-address').value = addr.road || '';
                document.getElementById('city').value = addr.city || addr.town || addr.village || '';
                document.getElementById('pincode').value = addr.postcode || '';
            }
        } catch (e) {
            console.warn('Could not auto-fill address.', e);
        }
    }

    document.getElementById('use-current-location-btn').addEventListener('click', () => {
         if (navigator.geolocation) {
            showNotification('Getting your location...', 'info');
            navigator.geolocation.getCurrentPosition( (position) => {
                const { latitude, longitude } = position.coords;
                if(reportMap) {
                    const latLng = L.latLng(latitude, longitude);
                    reportMap.setView(latLng, 16);
                    locationMarker.setLatLng(latLng);
                    updateCoordsFromMarker(latLng);
                }
            }, () => showNotification('Could not get location.', 'error'));
        }
    });

    document.getElementById('file-upload').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('image-preview').src = e.target.result;
                document.getElementById('image-preview').classList.add('visible');
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('report-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Server responded with an error.');
            }
            
            showNotification('Report submitted successfully!', 'success');
            e.target.reset();
            document.getElementById('image-preview').classList.remove('visible');
            setTimeout(() => {
                window.location.href = 'userhome.html';
            }, 2000);

        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Report';
        }
    });

    // Initial Setup
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
    initializeReportMap();
});
