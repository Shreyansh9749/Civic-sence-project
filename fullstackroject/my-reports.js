// document.addEventListener('DOMContentLoaded', () => {

//     // --- State Management ---
//     // In a real app, you would get the user's email after they log in.
//     // For this demo, we'll use a sample email to fetch reports.
//     const currentUserEmail = 'shreyansh@example.com'; 

//     // --- DOM Elements ---
//     const listEl = document.getElementById('my-issues-list-container');

//     // --- Notification System ---
//     const notificationContainer = document.getElementById('notification-container');
//     function showNotification(message, type = 'info') {
//         const toast = document.createElement('div');
//         toast.className = `toast ${type}`;
//         toast.textContent = message;
//         if(notificationContainer) notificationContainer.appendChild(toast);
//         requestAnimationFrame(() => { toast.classList.add('show'); });
//         setTimeout(() => {
//             toast.classList.remove('show');
//             toast.addEventListener('transitionend', () => toast.remove());
//         }, 5000);
//     }

//     // --- Theme Management ---
//     function applyTheme(theme) {
//         document.body.className = theme;
//         localStorage.setItem('theme', theme);
//     }
//     function toggleTheme() {
//         const currentTheme = localStorage.getItem('theme') || 'light-theme';
//         const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
//         applyTheme(newTheme);
//     }
//     document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

//     // --- Data Fetching and Display ---
//     async function fetchAndDisplayMyIssues() {
//         if (!currentUserEmail) {
//             listEl.innerHTML = '<p class="error-message">No user email found. Cannot fetch reports.</p>';
//             return;
//         };

//         listEl.innerHTML = '<p class="loading-placeholder">Loading your issues...</p>';
        
//         // This is the API endpoint your backend needs to provide.
       
//         const apiUrl = "http://localhost:8080/api/reports?reporterEmail=" + currentUserEmail;


//         try {
//             const response = await fetch(apiUrl);
            
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch issues. Server responded with status ${response.status}.`);
//             }
            
//             const reports = await response.json();

//             if (reports.length === 0) {
//                 listEl.innerHTML = '<p class="no-issues-message">You have not reported any issues yet.</p>';
//                 return;
//             }

//             listEl.innerHTML = reports.map(report => {
//                 const statusClass = report.status ? report.status.toLowerCase().replace(' ', '-') : 'submitted';
//                 const address = `${report.street}, ${report.city} - ${report.pincode}`;
//                 return `
//                 <div class="issue-item">
//                     <div class="issue-item-header">
//                         <h3>${report.category.charAt(0).toUpperCase() + report.category.slice(1)}</h3>
//                         <span class="issue-item-status ${statusClass}">${report.status || 'Submitted'}</span>
//                     </div>
//                     <p class="issue-item-address">${address}</p>
//                     <p>${report.description || 'No description provided.'}</p>
//                 </div>
//                 `;
//             }).join('');

//         } catch(error) {
//              listEl.innerHTML = `<p class="error-message">${error.message}</p>`;
//              showNotification('Could not load your reports.', 'error');
//         }
//     }

//     // --- Initial Setup ---
//     const savedTheme = localStorage.getItem('theme') || 'light-theme';
//     applyTheme(savedTheme);
    
//     // Fetch issues when the page loads
//     fetchAndDisplayMyIssues();
// });

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const listEl = document.getElementById('my-issues-list-container');
    const notificationContainer = document.getElementById('notification-container');

    // --- Notification System ---
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
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

    // --- Data Fetching and Display ---
    async function fetchAndDisplayMyIssues() {
        // *** KEY CHANGE: Read the user's email from localStorage. ***
        const currentUserEmail = localStorage.getItem('civic-reporter-user-email'); 

        // If no email is found, the user isn't logged in.
        if (!currentUserEmail) {
            listEl.innerHTML = `
                <div class="issue-item" style="text-align: center;">
                    <h3>Please Log In First</h3>
                    <p>We couldn't find a logged-in user. Please go back to the login page.</p>
                    <a href="login.html" style="display: inline-block; margin-top: 1rem; color: var(--primary-green); font-weight: 600;">Go to Login</a>
                </div>
            `;
            return;
        }

        listEl.innerHTML = '<p class="loading-placeholder">Loading your issues...</p>';
        
        // Use the dynamically retrieved email in the API call.
        // Replace with your actual backend URL
        const apiUrl = `http://localhost:8080/api/reports?reporterEmail=${currentUserEmail}`;

        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch issues. Server responded with status ${response.status}.`);
            }
            
            const reports = await response.json();

            if (reports.length === 0) {
                listEl.innerHTML = '<p class="no-issues-message">You have not reported any issues yet.</p>';
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
                `;
            }).join('');

        } catch(error) {
             listEl.innerHTML = `<p class="error-message">${error.message}</p>`;
             showNotification('Could not load your reports.', 'error');
        }
    }

    // --- Initial Setup ---
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
    
    // Fetch issues when the page loads
    fetchAndDisplayMyIssues();
});

