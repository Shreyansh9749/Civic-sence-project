document.addEventListener('DOMContentLoaded', () => {

    let fakeReports = [
        { id: 1, category: 'pothole', description: 'Large pothole causing traffic issues.', latitude: 23.1686, longitude: 79.9336, status: 'Submitted', street: 'Russel Chowk', landmark: 'Near Samdareeya Mall', city: 'Jabalpur', pincode: '482001' },
        { id: 2, category: 'streetlight', description: 'Streetlight out.', latitude: 23.165, longitude: 79.942, status: 'In Progress', street: 'Naudra Bridge', landmark: '', city: 'Jabalpur', pincode: '482001' },
        { id: 3, category: 'waste', description: 'Trash bin overflowing.', latitude: 23.173, longitude: 79.936, status: 'Resolved', street: 'Bhawartal Garden Road', landmark: 'Main Gate', city: 'Jabalpur', pincode: '482002' },
    ];

    let reportMap;
    let locationMarker;

    const pages = {
        home: document.getElementById('home-page'),
        myIssues: document.getElementById('my-reports-page'),
    };
    
    const modals = {
        report: document.getElementById('report-modal'),
    };

    const notificationContainer = document.getElementById('notification-container');
    function showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        if (notificationContainer) notificationContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 5000);
    }

    function showPage(pageId) {
        Object.values(pages).forEach(page => page && page.classList.remove('visible'));
        if (pages[pageId]) pages[pageId].classList.add('visible');
        if (pageId === 'myIssues') fetchAndDisplayMyIssues();
    }
    
    function setupHeader() {
        const headerControls = document.getElementById('header-controls');
        headerControls.innerHTML = `
            <button id="home-nav-btn">Home</button>
            <button id="my-issues-nav-btn-header">My Issues</button>
            <a href="admin.html" style="text-decoration:none;"><button>Admin View</button></a>
            <button id="theme-toggle-btn" title="Toggle Theme">
                <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.92-.99 6.752-2.648z" /></svg>
            </button>
        `;
        document.getElementById('home-nav-btn').addEventListener('click', () => showPage('home'));
        document.getElementById('my-issues-nav-btn-header').addEventListener('click', () => showPage('myIssues'));
        document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
    }
    
    function applyTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }
    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light-theme';
        const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
        applyTheme(newTheme);
    }

    const openModal = (modalId) => {
        if (modals[modalId]) {
            modals[modalId].classList.remove('hidden');
            if (modalId === 'report') initializeReportMap();
        }
    };
    const closeModal = (modalId) => {
        if (modals[modalId]) {
            modals[modalId].classList.add('hidden');
            if(modalId === 'report' && reportMap) {
                reportMap.remove();
                reportMap = null;
            }
        }
    };

    document.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.modalId)));
    document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal(modal.id.replace('-modal', ''));
    }));

    function initializeReportMap() {
        if (reportMap) return;
        try {
            reportMap = L.map('report-map').setView([23.16, 79.93], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(reportMap);
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
        } catch (e) { console.warn('Could not auto-fill address.', e); }
    }

    async function fetchAndDisplayMyIssues() {
        const listEl = document.getElementById('my-issues-list-container');
        listEl.innerHTML = '<p class="loading-placeholder">Loading issues...</p>';
        try {
            const reports = await Promise.resolve(fakeReports); // Using fake data for now
            if (reports.length === 0) {
                listEl.innerHTML = '<p class="no-issues-message">No issues have been reported yet.</p>';
                return;
            }
            listEl.innerHTML = reports.map(report => {
                const statusClass = `status-${(report.status || 'submitted').toLowerCase().replace(' ', '-')}`;
                const address = `${report.street}, ${report.city} - ${report.pincode}`;
                return `
                <div class="issue-item">
                    <div class="issue-item-header">
                        <h3>${report.category.charAt(0).toUpperCase() + report.category.slice(1)}</h3>
                        <span class="issue-item-status ${statusClass}">${report.status || 'Submitted'}</span>
                    </div>
                    <p class="issue-item-address">${address}</p>
                    <p>${report.description || 'No description provided.'}</p>
                </div>`;
            }).join('');
        } catch(error) {
             listEl.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    }

    document.getElementById('report-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        const formData = new FormData(e.target);
        const newReport = {
            id: fakeReports.length + 1,
            category: formData.get('category'),
            description: formData.get('description'),
            latitude: parseFloat(formData.get('latitude')),
            longitude: parseFloat(formData.get('longitude')),
            status: 'Submitted',
            street: formData.get('street'),
            landmark: formData.get('landmark'),
            city: formData.get('city'),
            pincode: formData.get('pincode'),
        };
        
        fakeReports.push(newReport);
        showNotification('Report submitted successfully!', 'success');
        closeModal('report');
        e.target.reset();
        document.getElementById('image-preview').classList.remove('visible');
        
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Report';
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

    // Initial Setup
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
    setupHeader();
    
    document.getElementById('hero-report-btn').addEventListener('click', () => openModal('report'));
    document.getElementById('my-reports-nav-btn').addEventListener('click', () => showPage('myIssues'));
    document.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => showPage('home')));
});
