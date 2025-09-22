// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.getElementById('theme-icon');
    if(document.body.classList.contains('dark-theme')){
        icon.innerHTML = `<path d="M21 12.79A9 9 0 0111.21 3a7 7 0 0011.58 9.79z"></path>`;
        icon.setAttribute('stroke', 'white');
        localStorage.setItem('theme', 'dark');
    } else {
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
        icon.setAttribute('stroke', 'currentColor');
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') document.body.classList.add('dark-theme');
    fetchReports();
});

// Fetch reports from backend
async function fetchReports() {
    try {
        const response = await fetch('http://localhost:8080/api/reports'); // Adjust API endpoint
        const reports = await response.json();

        // Update cards
        const total = reports.length;
        const open = reports.filter(r => r.status === "Submitted").length;
        const closed = reports.filter(r => r.status === "resolved").length;
        document.getElementById('total-reports').textContent = total;
        document.getElementById('open-reports').textContent = open;
        document.getElementById('closed-reports').textContent = closed;

        // Populate table
        const tbody = document.getElementById('recent-reports-body');
        tbody.innerHTML = '';
        reports.slice(0, 10).forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${r.id}</td><td>${r.reporterName}</td><td>${r.status}</td><td>${r.city}</td>`;
            tbody.appendChild(tr);
        });

        // Status Chart
        const statusCtx = document.getElementById('statusChart').getContext('2d');
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Open', 'Closed'],
                datasets: [{
                    data: [open, closed],
                    backgroundColor: ['#16A34A', '#EF4444'],
                }]
            },
            options: { responsive: true }
        });

        // Category Chart
        const categories = [...new Set(reports.map(r => r.category))];
        const categoryCounts = categories.map(cat => reports.filter(r => r.category === cat).length);
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Reports by Category',
                    data: categoryCounts,
                    backgroundColor: '#16A34A',
                }]
            },
            options: { responsive: true }
        });

    } catch (err) {
        console.error("Error fetching reports:", err);
    }
}
