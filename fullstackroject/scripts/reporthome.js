document.addEventListener('DOMContentLoaded', () => {

    // --- FAKE BACKEND / MOCK DATA ---
    // let fakeReports = [
    //     { id: 1, category: 'pothole', description: 'Large pothole causing traffic issues.', latitude: 23.1686, longitude: 79.9336, reporterName: 'Amit Sharma', reporterEmail: 'amit@example.com', status: 'Submitted', street: 'Russel Chowk', landmark: 'Near Samdareeya Mall', city: 'Jabalpur', pincode: '482001' },
    //     { id: 2, category: 'streetlight', description: 'Streetlight out.', latitude: 23.165, longitude: 79.942, reporterName: 'Priya Verma', reporterEmail: 'priya@example.com', status: 'In Progress', street: 'Naudra Bridge', landmark: '', city: 'Jabalpur', pincode: '482001' },
    //     { id: 3, category: 'waste', description: 'Trash bin overflowing.', latitude: 23.173, longitude: 79.936, reporterName: 'Amit Sharma', reporterEmail: 'amit@example.com', status: 'Resolved', street: 'Bhawartal Garden Road', landmark: 'Main Gate', city: 'Jabalpur', pincode: '482002' },
    //     { id: 4, category: 'graffiti', description: 'Graffiti on the wall.', latitude: 23.170, longitude: 79.935, reporterName: 'Rohan Gupta', reporterEmail: 'rohan@example.com', status: 'Submitted', street: 'Gol Bazar', landmark: 'Rani Durgavati Museum', city: 'Jabalpur', pincode: '482002' },
    // ];

    // const fakeApi = {
    //     getReports: (filters = {}) => {
    //         return new Promise(resolve => {
    //             setTimeout(() => {
    //                 let reports = fakeReports;
    //                 if (filters.status && filters.status !== 'All') {
    //                      reports = reports.filter(r => r.status === filters.status);
    //                 }
    //                 resolve(reports);
    //             }, 500);
    //         });
    //     }
    // };
    // --- END OF FAKE BACKEND ---

    // --- State Management ---
    let adminMap;
    let adminReportsLayer = L.layerGroup();

    // --- DOM Elements ---
    // const pages = {
    //     home: document.getElementById('home-page'),
    //     allIssues: document.getElementById('all-issues-page'),
    //     admin: document.getElementById('admin-page'),
    // };
    // const statusFilter = document.getElementById('status-filter');

    // // --- Notification System ---
    // const notificationContainer = document.getElementById('notification-container');
    // function showNotification(message, type = 'info') {
    //     const toast = document.createElement('div');
    //     toast.className = `toast ${type}`;
    //     toast.textContent = message;
    //     notificationContainer.appendChild(toast);
    //     requestAnimationFrame(() => { toast.classList.add('show'); });
    //     setTimeout(() => {
    //         toast.classList.remove('show');
    //         toast.addEventListener('transitionend', () => toast.remove());
    //     }, 5000);
    // }

    // --- UI Update Functions & Page Navigation ---
    function showPage(pageId) {
        // Object.values(pages).forEach(page => {
        //     if (page) page.classList.remove('visible');
        // });
        // if(pages[pageId]) pages[pageId].classList.add('visible');

        if (pageId === 'Home') {
           window.location.href = "userhome.html";
        }
        if (pageId === 'MyReports') {
           
                window.location.href = "my-reports.html";
           
        }
    }

    function setupHeader() {
        const headerControls = document.getElementById('header-controls');
        headerControls.innerHTML = `
            <button id="all-issues-btn">Home</button>
            <button id="admin-view-btn">My Reports</button>
            <button id="theme-toggle-btn" title="Toggle Theme">
                <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.92-.99 6.752-2.648z" /></svg>
            </button>
        `;
        document.getElementById('all-issues-btn').addEventListener('click', () => showPage('Home'));
        document.getElementById('admin-view-btn').addEventListener('click', () => showPage('MyReports'));
        document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
    }

    // --- Theme Management ---
    function applyTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }
    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light-theme';
        const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
        applyTheme(newTheme);
    }

    // --- Leaflet Map and Geolocation ---
    // function initializeAdminMap() {
    //     if (adminMap) return;
    //     try {
    //         adminMap = L.map('admin-map').setView([23.16, 79.93], 13);
    //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //             maxZoom: 19,
    //             attribution: '© OpenStreetMap'
    //         }).addTo(adminMap);
    //         adminReportsLayer.addTo(adminMap);
    //     } catch (error) {
    //         console.error("Admin map initialization failed:", error);
    //         document.getElementById('admin-map').innerHTML = `<p style="color:red">Failed to load map.</p>`;
    //     }
    // }
    
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

    // function addReportToAdminMap(report) {
    //     const address = `${report.street}, ${report.city}`;
    //     const popupContent = `<h3>${report.category} (${report.status})</h3><p>${address}</p><small>Description: ${report.description || 'N/A'}</small>`;
    //     const status_map = {'Submitted': yellowIcon, 'In Progress': yellowIcon, 'Resolved': greenIcon}
    //     const icon = status_map[report.status] || yellowIcon;

    //     const marker = L.marker([report.latitude, report.longitude], { icon: icon })
    //         .bindPopup(popupContent);
    //     adminReportsLayer.addLayer(marker);
    // }

    // --- Data Fetching and Display ---
    // async function fetchAndDisplayAdminReports() {
        // try {
        //     const status = statusFilter.value;
        //     const reports = await fakeApi.getReports({ status });
        //     adminReportsLayer.clearLayers();
        //     reports.forEach(addReportToAdminMap);
        // } catch (error) {
        //     showNotification(error.message, 'error');
        // }
    // }
    
    // async function fetchAndDisplayAllIssues() {
        // const listEl = document.getElementById('all-issues-list-container');
        // listEl.innerHTML = '<p>Loading issues...</p>';
        // try {
        //     const reports = await fakeApi.getReports();

        //     if (reports.length === 0) {
        //         listEl.innerHTML = '<p>No issues have been reported yet.</p>';
        //         return;
        //     }

        //     listEl.innerHTML = reports.map(report => {
        //         const statusClass = report.status ? report.status.toLowerCase().replace(' ', '-') : 'submitted';
        //         const address = `${report.street}, ${report.city} - ${report.pincode}`;
        //         return `
        //         <div class="issue-item">
        //             <div class="issue-item-header">
        //                 <h3>${report.category.charAt(0).toUpperCase() + report.category.slice(1)}</h3>
        //                 <span class="issue-item-status ${statusClass}">${report.status || 'Submitted'}</span>
        //             </div>
        //             <p class="issue-item-address">${address}</p>
        //             <p>${report.description || 'No description provided.'}</p>
        //         </div>
        //         `}).join('');
        // } catch(error) {
        //      listEl.innerHTML = `<p style="color:var(--red-500);">${error.message}</p>`;
        // }
    // }

    // --- Initial Setup ---
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
    setupHeader();
    
    document.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => showPage('home')));
    statusFilter.addEventListener('change', fetchAndDisplayAdminReports);
    
    // Check for #admin hash to auto-navigate
    if (window.location.hash === '#admin') {
         showPage('admin');
    }
});

