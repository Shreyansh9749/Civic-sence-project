document.addEventListener('DOMContentLoaded', () => {

        // --- FAKE BACKEND / MOCK DATA ---
        let fakeReports = [
            { id: 1, category: 'pothole', description: 'Large pothole causing traffic issues.', latitude: 23.1686, longitude: 79.9336, reporterName: 'Amit Sharma', reporterEmail: 'amit@example.com', status: 'Submitted', street: 'Russel Chowk', landmark: 'Near Samdareeya Mall', city: 'Jabalpur', pincode: '482001' },
            { id: 2, category: 'streetlight', description: 'Streetlight out.', latitude: 23.165, longitude: 79.942, reporterName: 'Priya Verma', reporterEmail: 'priya@example.com', status: 'In Progress', street: 'Naudra Bridge', landmark: '', city: 'Jabalpur', pincode: '482001' },
            { id: 3, category: 'waste', description: 'Trash bin overflowing.', latitude: 23.173, longitude: 79.936, reporterName: 'Amit Sharma', reporterEmail: 'amit@example.com', status: 'Resolved', street: 'Bhawartal Garden Road', landmark: 'Main Gate', city: 'Jabalpur', pincode: '482002' },
            { id: 4, category: 'graffiti', description: 'Graffiti on the wall.', latitude: 23.170, longitude: 79.935, reporterName: 'Rohan Gupta', reporterEmail: 'rohan@example.com', status: 'Submitted', street: 'Gol Bazar', landmark: 'Rani Durgavati Museum', city: 'Jabalpur', pincode: '482002' },
        ];

        const fakeApi = {
            getReports: (filters = {}) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        let reports = fakeReports;
                        if (filters.email) {
                            reports = reports.filter(r => r.reporterEmail === filters.email);
                        }
                        if (filters.status && filters.status !== 'All') {
                             reports = reports.filter(r => r.status === filters.status);
                        }
                        resolve(reports);
                    }, 500);
                });
            },
            addReport: (formData) => {
                 return new Promise(resolve => {
                    setTimeout(() => {
                        let lat = parseFloat(formData.get('latitude'));
                        let lng = parseFloat(formData.get('longitude'));
                       
                        const newReport = {
                            id: fakeReports.length + 1,
                            category: formData.get('category'),
                            description: formData.get('description'),
                            latitude: lat,
                            longitude: lng,
                            reporterName: formData.get('reporterName'),
                            reporterEmail: formData.get('reporterEmail'),
                            status: 'Submitted',
                            street: formData.get('street'),
                            landmark: formData.get('landmark'),
                            city: formData.get('city'),
                            pincode: formData.get('pincode'),
                        };
                        fakeReports.push(newReport);
                        resolve(newReport);
                    }, 800);
                });
            }
        };
        // --- END OF FAKE BACKEND ---

        // --- State Management ---
        let currentUser = null;
        let adminMap, reportMap;
        let adminReportsLayer = L.layerGroup();
        let locationMarker;

        // --- DOM Elements ---
        const pages = {
            home: document.getElementById('home-page'),
            myIssues: document.getElementById('my-issues-page'),
            admin: document.getElementById('admin-page'),
        };
        const headerControls = document.getElementById('header-controls');
        const heroReportBtn = document.getElementById('hero-report-btn');
        const reportIssueBtn = document.getElementById('report-issue-btn'); // FAB
        const reportForm = document.getElementById('report-form');
        const statusFilter = document.getElementById('status-filter');
        const modals = {
            login: document.getElementById('login-modal'),
            report: document.getElementById('report-modal'),
        };

        // --- Notification System ---
        const notificationContainer = document.getElementById('notification-container');
        function showNotification(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            notificationContainer.appendChild(toast);
            requestAnimationFrame(() => { toast.classList.add('show'); });
            setTimeout(() => {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => toast.remove());
            }, 5000);
        }

        // --- UI Update Functions & Page Navigation ---
        function showPage(pageId) {
            Object.values(pages).forEach(page => page.classList.remove('visible'));
            pages[pageId].classList.add('visible');

            if (pageId === 'myIssues') {
                fetchAndDisplayMyIssues();
            }
            if (pageId === 'admin') {
                initializeAdminMap();
                fetchAndDisplayAdminReports();
                // Ensure map renders correctly
                setTimeout(() => adminMap && adminMap.invalidateSize(), 10);
            }
        }

        function updateUIForLogin() {
            headerControls.innerHTML = `
                <span class="user-info">Welcome, ${currentUser.name}!</span>
                <button id="my-issues-btn">My Issues</button>
                <button id="admin-view-btn">Admin View</button>
                <button id="logout-btn">Logout</button>
            `;
            heroReportBtn.disabled = false;
            heroReportBtn.title = "Report a new issue";
            reportIssueBtn.disabled = false;
            reportIssueBtn.title = "Report a new issue";
            document.getElementById('my-issues-btn').addEventListener('click', () => showPage('myIssues'));
            document.getElementById('admin-view-btn').addEventListener('click', () => showPage('admin'));
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        }

        function updateUIForLogout() {
            headerControls.innerHTML = `<button id="login-btn">Login / Sign Up</button>`;
            heroReportBtn.disabled = true;
            heroReportBtn.title = "Log in to report an issue";
            reportIssueBtn.disabled = true;
            reportIssueBtn.title = "Log in to report an issue";
            document.getElementById('login-btn').addEventListener('click', () => openModal('login'));
        }

        // --- Modal Handling ---
        const openModal = (modalId) => {
            modals[modalId].classList.remove('hidden');
            if (modalId === 'report') {
                initializeReportMap();
            }
        };
        const closeModal = (modalId) => {
             modals[modalId].classList.add('hidden');
             if(modalId === 'report' && reportMap) {
                 reportMap.remove();
                 reportMap = null;
             }
        };
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => closeModal(btn.dataset.modalId));
        });
        document.querySelectorAll('.modal').forEach(modal => {
             modal.addEventListener('click', (event) => {
                if (event.target === modal) closeModal(modal.id.replace('-modal', ''));
            });
        });

        // --- Authentication ---
        function checkLoginStatus() {
            const user = localStorage.getItem('civic-reporter-user');
            if (user) {
                currentUser = JSON.parse(user);
                updateUIForLogin();
            } else {
                updateUIForLogout();
            }
        }

        function handleLogin(e) {
            e.preventDefault();
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            if (name && email) {
                currentUser = { name, email };
                localStorage.setItem('civic-reporter-user', JSON.stringify(currentUser));
                updateUIForLogin();
                closeModal('login');
                showNotification(`Welcome, ${name}!`, 'success');
            }
        }

        function handleLogout() {
            currentUser = null;
            localStorage.removeItem('civic-reporter-user');
            updateUIForLogout();
            showNotification('You have been logged out.', 'info');
        }

        // --- Leaflet Map and Geolocation ---
        function initializeAdminMap() {
            if (adminMap) return;
            try {
                adminMap = L.map('admin-map').setView([23.16, 79.93], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(adminMap);
                adminReportsLayer.addTo(adminMap);
            } catch (error) {
                console.error("Admin map initialization failed:", error);
                document.getElementById('admin-map').innerHTML = `<p style="color:red">Failed to load map.</p>`;
            }
        }

        function initializeReportMap() {
            if (reportMap) reportMap.remove();
             try {
                reportMap = L.map('report-map').setView([23.16, 79.93], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(reportMap);
                
                locationMarker = L.marker(reportMap.getCenter(), { draggable: true }).addTo(reportMap);
                updateCoordsFromMarker(locationMarker.getLatLng());

                locationMarker.on('dragend', (e) => {
                    updateCoordsFromMarker(e.target.getLatLng());
                });

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
            
             // Reverse Geocode to get address
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
        
        const greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });
        const yellowIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        function addReportToAdminMap(report) {
            const address = `${report.street}, ${report.city}`;
            const popupContent = `<h3>${report.category} (${report.status})</h3><p>${address}</p><small>Description: ${report.description || 'N/A'}</small>`;
            const status_map = {'Submitted': yellowIcon, 'In Progress': yellowIcon, 'Resolved': greenIcon}
            const icon = status_map[report.status] || yellowIcon;

            const marker = L.marker([report.latitude, report.longitude], { icon: icon })
                .bindPopup(popupContent);
            adminReportsLayer.addLayer(marker);
        }

        // --- Data Fetching and Display ---
        async function fetchAndDisplayAdminReports() {
            try {
                const status = statusFilter.value;
                const reports = await fakeApi.getReports({ status });
                adminReportsLayer.clearLayers();
                reports.forEach(addReportToAdminMap);
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
        
        async function fetchAndDisplayMyIssues() {
            if (!currentUser) return;
            const listEl = document.getElementById('my-issues-list-container');
            listEl.innerHTML = '<p>Loading your issues...</p>';
            try {
                const reports = await fakeApi.getReports({ email: currentUser.email });

                if (reports.length === 0) {
                    listEl.innerHTML = '<p>You have not reported any issues yet.</p>';
                    return;
                }

                listEl.innerHTML = reports.map(report => {
                    const statusClass = report.status ? report.status.toLowerCase().replace(' ', '-') : 'submitted';
                    const address = `${report.street}, ${report.city} - ${report.pincode}`;
                    return `
                    <div class="issue-item">
                        <div class="issue-item-header">
                            <h3>${report.category.charAt(0).toUpperCase() + report.category.slice(1)}</h3>
                            <span class="issue-item-status ${statusClass}">${report.status || 'Submitted'}</span>
                        </div>
                        <p class="issue-item-address">${address}</p>
                        <p>${report.description || 'No description provided.'}</p>
                    </div>
                `}).join('');
            } catch(error) {
                 listEl.innerHTML = `<p style="color:var(--red-500);">${error.message}</p>`;
            }
        }

        // --- Form Handling ---
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = e.target.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            document.getElementById('reporterName').value = currentUser.name;
            document.getElementById('reporterEmail').value = currentUser.email;

            const formData = new FormData(e.target);
            try {
                const newReport = await fakeApi.addReport(formData);
                addReportToAdminMap(newReport); 
                showNotification('Report submitted successfully!', 'success');
                closeModal('report');
                reportForm.reset();
                document.getElementById('image-preview').classList.remove('visible');
            } catch (error) {
                showNotification(`Error: ${error.message}`, 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Report';
            }
        });

        const fileUpload = document.getElementById('file-upload');
        fileUpload.addEventListener('change', (event) => {
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

        // --- Initial Setup ---
        checkLoginStatus();
        
        const reportAction = () => openModal('report');
        heroReportBtn.addEventListener('click', reportAction);
        reportIssueBtn.addEventListener('click', reportAction);
        
        document.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => showPage('home')));
        
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        statusFilter.addEventListener('change', fetchAndDisplayAdminReports);
        document.getElementById('use-current-location-btn').addEventListener('click', () => {
             if (navigator.geolocation) {
                showNotification('Getting your location...', 'info');
                navigator.geolocation.getCurrentPosition( (position) => {
                    const { latitude, longitude } = position.coords;
                    reportMap.setView([latitude, longitude], 16);
                    locationMarker.setLatLng([latitude, longitude]);
                    updateCoordsFromMarker(L.latLng(latitude, longitude));
                }, () => showNotification('Could not get location.', 'error'));
            }
        });
    });