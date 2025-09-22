// document.addEventListener('DOMContentLoaded', () => {
//     const userRoleBtn = document.getElementById('user-role-btn');
//     const adminRoleBtn = document.getElementById('admin-role-btn');
//     const loginForm = document.getElementById('login-form');
//     const googleBtn = document.querySelector('.google-btn');

//     let selectedRole = 'user'; // Default role

//     // Role selection logic
//     userRoleBtn.addEventListener('click', () => {
//         if (!userRoleBtn.classList.contains('active')) {
//             userRoleBtn.classList.add('active');
//             adminRoleBtn.classList.remove('active');
//             selectedRole = 'user';
//             console.log('Role selected:', selectedRole);
//         }
//     });

//     adminRoleBtn.addEventListener('click', () => {
//         if (!adminRoleBtn.classList.contains('active')) {
//             adminRoleBtn.classList.add('active');
//             userRoleBtn.classList.remove('active');
//             selectedRole = 'admin';
//             console.log('Role selected:', selectedRole);
//         }
//     });

//     // Google login handler
//     googleBtn.addEventListener('click', () => {
//         // In a real application, you would trigger the Google OAuth flow here.
//         alert(`Simulating Google login for role: ${selectedRole}`);
//         if (selectedRole === 'admin') {
//             // Redirect to the admin section of the app
//             window.location.href = 'admin.html';
//         } else {
//             // Redirect to the user section of the app
//             window.location.href = 'userhome.html';
//         }
//     });

//     // Form submission handler
//     loginForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         // In a real application, you would send these credentials to a backend for verification.
//         console.log({
//             role: selectedRole,
//             email: email,
//             password: '***' // Never log the actual password
//         });

//         alert(`Simulating login for ${selectedRole} with email: ${email}`);

//         if (selectedRole === 'admin') {
//             // Redirect to the admin section of the app
//             window.location.href = 'admin.html';
//         } else {
//             // Redirect to the user section of the app
//             window.location.href = 'userhome.html';
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const userRoleBtn = document.getElementById('user-role-btn');
    const adminRoleBtn = document.getElementById('admin-role-btn');
    const loginForm = document.getElementById('login-form');
    const googleBtn = document.querySelector('.google-btn');

    let selectedRole = 'user'; // Default role

    userRoleBtn.addEventListener('click', () => {
        if (!userRoleBtn.classList.contains('active')) {
            userRoleBtn.classList.add('active');
            adminRoleBtn.classList.remove('active');
            selectedRole = 'user';
        }
    });

    adminRoleBtn.addEventListener('click', () => {
        if (!adminRoleBtn.classList.contains('active')) {
            adminRoleBtn.classList.add('active');
            userRoleBtn.classList.remove('active');
            selectedRole = 'admin';
        }
    });

    function handleLogin(email) {
        // Save the user's email to localStorage
        localStorage.setItem('civic-reporter-user-email', email);

        // In a real app with security, you would get a token from the backend.
        // For now, we just redirect.
        alert(`Logged in as ${selectedRole} with email: ${email}`);

        if (selectedRole === 'admin') {
            window.location.href = 'admin.html'; // Or your main admin page
        } else {
            window.location.href = 'userhome.html'; // Or your main user page
        }
    }

    googleBtn.addEventListener('click', () => {
        // This is a placeholder for a real Google OAuth flow.
        const sampleGoogleEmail = 'shreyansh@example.com';
        handleLogin(sampleGoogleEmail);
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        handleLogin(email);
    });
});

