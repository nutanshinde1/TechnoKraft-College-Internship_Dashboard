
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sidebar Toggle Logic ---
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.getElementById('mainWrapper');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth >= 992) {
            sidebar.classList.toggle('collapsed');
            mainWrapper.classList.toggle('expanded');
        } else {
            sidebar.classList.toggle('show');
        }
    });

    // Initialize Bootstrap Tooltips for collapsed sidebar
    const tooltipTriggerList = document.querySelectorAll('[data-tooltip]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        title: function() {
            if (sidebar.classList.contains('collapsed')) {
                return tooltipTriggerEl.getAttribute('data-tooltip');
            }
            return '';
        },
        placement: 'right',
        trigger: 'hover',
        container: 'body'
    }));

    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992 && 
            !sidebar.contains(e.target) && 
            !toggleBtn.contains(e.target) && 
            sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // --- 2. User Profile Dropdown ---
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
    
    // Handle dropdown actions
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = item.getAttribute('data-action');
            userDropdown.classList.remove('show');
            
            switch(action) {
                case 'profile':
                    userDropdown.classList.remove('show');
                    const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
                    profileModal.show();
                    break;
                case 'settings':
                    userDropdown.classList.remove('show');
                    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
                    settingsModal.show();
                    break;
                case 'reset-password':
                    userDropdown.classList.remove('show');
                    Swal.fire({
                        title: 'Reset Password',
                        html: `
                            <input type="password" id="current-password" class="swal2-input" placeholder="Current Password">
                            <input type="password" id="new-password" class="swal2-input" placeholder="New Password">
                            <input type="password" id="confirm-password" class="swal2-input" placeholder="Confirm Password">
                        `,
                        confirmButtonText: 'Update Password',
                        confirmButtonColor: '#4f46e5',
                        focusConfirm: false,
                        preConfirm: () => {
                            const current = document.getElementById('current-password').value;
                            const newPass = document.getElementById('new-password').value;
                            const confirm = document.getElementById('confirm-password').value;
                            
                            if (!current || !newPass || !confirm) {
                                Swal.showValidationMessage('Please fill all fields');
                                return false;
                            }
                            if (newPass !== confirm) {
                                Swal.showValidationMessage('Passwords do not match');
                                return false;
                            }
                            if (newPass.length < 8) {
                                Swal.showValidationMessage('Password must be at least 8 characters');
                                return false;
                            }
                            return { current, newPass, confirm };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: 'Password updated successfully',
                                confirmButtonColor: '#4f46e5'
                            });
                        }
                    });
                    break;
                case 'notifications':
                    userDropdown.classList.remove('show');
                    const notificationsModal = new bootstrap.Modal(document.getElementById('notificationsModal'));
                    notificationsModal.show();
                    break;
                case 'help':
                    userDropdown.classList.remove('show');
                    Swal.fire({
                        title: 'Help & Support',
                        html: `
                            <div class="text-start">
                                <h6>Contact Support</h6>
                                <p class="text-muted small">Email: support@technokraft.com</p>
                                <p class="text-muted small">Phone: +91 98765 43210</p>
                                <hr>
                                <h6>Resources</h6>
                                <ul class="text-muted small">
                                    <li>User Documentation</li>
                                    <li>Video Tutorials</li>
                                    <li>FAQ Section</li>
                                </ul>
                            </div>
                        `,
                        icon: 'info',
                        confirmButtonColor: '#4f46e5'
                    });
                    break;
                case 'logout':
                    userDropdown.classList.remove('show');
                    Swal.fire({
                        title: 'Logout?',
                        text: "Are you sure you want to end your session?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#4f46e5',
                        cancelButtonColor: '#cbd5e1',
                        confirmButtonText: 'Yes, logout'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Logged out!',
                                text: 'You have been logged out successfully',
                                confirmButtonColor: '#4f46e5'
                            });
                        }
                    });
                    break;
            }
        });
    });

    // --- 3. Navigation Logic ---
    const menuLinks = document.querySelectorAll('.menu-link');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('pageTitle');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('data-page');
            viewSections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            pageTitle.textContent = link.querySelector('span').textContent;

            if (window.innerWidth < 992) {
                sidebar.classList.remove('show');
            }
        });
    });

    // --- 4. Mock Data & Table Rendering ---
    const interns = [
        { id: 1, name: "Priya patil", dept: "Development", date: "Oct 24, 2024", status: "active" },
        { id: 2, name: "kunal Verma", dept: "Design", date: "Oct 22, 2024", status: "active" },
        { id: 3, name: "Amit Patel", dept: "Marketing", date: "Oct 20, 2024", status: "pending" },
        { id: 4, name: "Sneha Reddy", dept: "Finance", date: "Oct 18, 2024", status: "inactive" },
        { id: 5, name: "Vikram Singh", dept: "Development", date: "Oct 15, 2024", status: "active" }
    ];

    const tableBody = document.getElementById('tableBody');

    const renderTable = () => {
        tableBody.innerHTML = '';
        interns.forEach(intern => {
            const initials = intern.name.split(' ').map(n => n[0]).join('');
            
            const row = `
                <tr>
                    <td>
                        <div class="user-cell">
                            <div class="avatar-initial">${initials}</div>
                            <div>
                                <div style="font-weight: 500; color: var(--dark)">${intern.name}</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted)">ID: #${intern.id}</div>
                            </div>
                        </div>
                    </td>
                    <td>${intern.dept}</td>
                    <td>${intern.date}</td>
                    <td><span class="status-badge status-${intern.status}">${intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}</span></td>
                    <td class="text-end">
                        <div class="d-flex gap-2 justify-content-end">
                            <button class="btn-sm-action" onclick="editUser(${intern.id})" title="Edit"><i class="bi bi-pencil"></i></button>
                            <button class="btn-sm-action" onclick="deleteUser(${intern.id})" title="Delete"><i class="bi bi-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    renderTable();

    // --- 5. Save New Intern ---
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
        const name = document.getElementById('formName').value;
        const dept = document.getElementById('formDept').value;
        const status = document.getElementById('formStatus').value;

        if (name) {
            interns.unshift({
                id: interns.length + 1,
                name: name,
                dept: dept,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: status
            });
            renderTable();
            
            const modalEl = document.getElementById('addModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            document.getElementById('addInternForm').reset();

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'New intern added successfully.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });

    // --- 6. Charts ---
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748b';
    
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    const gradient = ctxMain.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    new Chart(ctxMain, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
                label: 'Enrollments',
                data: [65, 78, 60, 95, 110, 102, 130, 145],
                borderColor: '#4f46e5',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#4f46e5',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    border: { display: false },
                    grid: { color: '#f1f5f9', borderDash: [5, 5] },
                    ticks: { padding: 10 }
                }
            }
        }
    });

    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
    new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Pending', 'Inactive'],
            datasets: [{
                data: [286, 38, 18],
                backgroundColor: ['#4f46e5', '#f59e0b', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 20 }
                }
            }
        }
    });

    // --- 7. Logout from Footer ---
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Swal.fire({
            title: 'Logout?',
            text: "Are you sure you want to end your session?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Logged out!', 'You have been logged out successfully', 'success');
            }
        });
    });
});

// Helper functions
window.deleteUser = (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Deleted!', 'User has been removed.', 'success');
        }
    });
};

window.editUser = (id) => {
    const modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
};

// Profile and Settings Save Functions
window.saveProfile = () => {
    Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        timer: 1500,
        showConfirmButton: false
    });
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
};

window.saveSettings = () => {
    Swal.fire({
        icon: 'success',
        title: 'Settings Saved!',
        text: 'Your settings have been saved successfully.',
        timer: 1500,
        showConfirmButton: false
    });
    bootstrap.Modal.getInstance(document.getElementById('settingsModal')).hide();
};
const internData = [
  {
    id: 1,
    name: "Amit Sharma",
    college: "ABC College of Engineering",
    domain: "Web Development",
    status: "Active",
    email: "amit.sharma@gmail.com",
    attendance: "92%",
    performance: "A"
  },
  {
    id: 2,
    name: "Neha Patil",
    college: "XYZ Institute of Technology",
    domain: "Data Science",
    status: "Completed",
    email: "neha.patil@gmail.com",
    attendance: "88%",
    performance: "B+"
  },
  {
    id: 3,
    name: "Rohit Verma",
    college: "Pune University",
    domain: "Software Development",
    status: "Active",
    email: "rohit.verma@gmail.com",
    attendance: "95%",
    performance: "A+"
  },
  {
    id: 4,
    name: "Sneha Reddy",
    college: "VIT Vellore",
    domain: "Frontend Development",
    status: "Active",
    email: "sneha.reddy@gmail.com",
    attendance: "90%",
    performance: "A"
  },
  {
    id: 5,
    name: "Kunal Joshi",
    college: "MIT Pune",
    domain: "Backend Development",
    status: "Active",
    email: "kunal.joshi@gmail.com",
    attendance: "85%",
    performance: "B+"
  },
  {
    id: 6,
    name: "Priya Kulkarni",
    college: "COEP Pune",
    domain: "UI/UX Design",
    status: "Completed",
    email: "priya.k@gmail.com",
    attendance: "93%",
    performance: "A"
  },
  {
    id: 7,
    name: "Aditya Singh",
    college: "Delhi Technological University",
    domain: "Machine Learning",
    status: "Active",
    email: "aditya.singh@gmail.com",
    attendance: "89%",
    performance: "A-"
  },
  {
    id: 8,
    name: "Pooja Nair",
    college: "NIT Trichy",
    domain: "Data Analytics",
    status: "Active",
    email: "pooja.nair@gmail.com",
    attendance: "91%",
    performance: "A"
  },
  {
    id: 9,
    name: "Rahul Mehta",
    college: "NMIMS Mumbai",
    domain: "Cloud Computing",
    status: "Pending",
    email: "rahul.mehta@gmail.com",
    attendance: "80%",
    performance: "B"
  },
  {
    id: 10,
    name: "Ananya Deshmukh",
    college: "SPIT Mumbai",
    domain: "Cyber Security",
    status: "Active",
    email: "ananya.d@gmail.com",
    attendance: "94%",
    performance: "A+"
  },
  {
    id: 11,
    name: "Saurabh Kulkarni",
    college: "IIT Bombay",
    domain: "AI Research",
    status: "Active",
    email: "saurabh.k@gmail.com",
    attendance: "97%",
    performance: "A+"
  },
  {
    id: 12,
    name: "Meera Iyer",
    college: "BITS Pilani",
    domain: "Full Stack Development",
    status: "Completed",
    email: "meera.iyer@gmail.com",
    attendance: "90%",
    performance: "A"
  }
];


// Load Intern List
const internTableBody = document.getElementById("internTableBody");

internData.forEach(intern => {
  internTableBody.innerHTML += `
    <tr>
      <td>${intern.id}</td>
      <td>${intern.name}</td>
      <td>${intern.college}</td>
      <td>${intern.domain}</td>
      <td>${intern.status}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="viewIntern(${intern.id})">View</button>
      </td>
    </tr>
  `;
});

// Tab switching
function showInternTab(tabId) {
  document.querySelectorAll(".intern-tab").forEach(tab => {
    tab.classList.add("d-none");
  });
  document.getElementById(tabId).classList.remove("d-none");
}

// View details
function viewIntern(id) {
  const intern = internData.find(i => i.id === id);
  showInternTab("internDetails");

  document.getElementById("detailsBox").innerHTML = `
    <p><strong>Name:</strong> ${intern.name}</p>
    <p><strong>Email:</strong> ${intern.email}</p>
    <p><strong>College:</strong> ${intern.college}</p>
    <p><strong>Domain:</strong> ${intern.domain}</p>
    <p><strong>Attendance:</strong> ${intern.attendance}</p>
    <p><strong>Performance:</strong> ${intern.performance}</p>
  `;
}

function backToInternList() {
  showInternTab("internList");
}

const attendanceData = [
  {
    date: "2025-09-10",
    name: "Amit Sharma",
    status: "Present",
    checkIn: "10:05 AM",
    checkOut: "6:15 PM"
  },
  {
    date: "2025-09-10",
    name: "Neha Patil",
    status: "Absent",
    checkIn: "-",
    checkOut: "-"
  },
  {
    date: "2025-09-10",
    name: "Rohit Verma",
    status: "Present",
    checkIn: "9:55 AM",
    checkOut: "6:05 PM"
  },
  {
    date: "2025-09-10",
    name: "Sneha Reddy",
    status: "Present",
    checkIn: "10:10 AM",
    checkOut: "6:00 PM"
  },
  {
    date: "2025-09-10",
    name: "Ananya Deshmukh",
    status: "Present",
    checkIn: "9:50 AM",
    checkOut: "6:20 PM"
  }
];

const attendanceTableBody = document.getElementById("attendanceTableBody");

attendanceData.forEach(record => {
  attendanceTableBody.innerHTML += `
    <tr>
      <td>${record.date}</td>
      <td>${record.name}</td>
      <td>
        <span class="badge ${
          record.status === "Present" ? "bg-success" : "bg-danger"
        }">
          ${record.status}
        </span>
      </td>
      <td>${record.checkIn}</td>
      <td>${record.checkOut}</td>
    </tr>
  `;
});


const workLogData = [
  {
    date: "2025-09-10",
    name: "Amit Sharma",
    task: "Designed login & registration UI",
    hours: 6,
    status: "Submitted"
  },
  {
    date: "2025-09-10",
    name: "Rohit Verma",
    task: "Implemented REST API for interns",
    hours: 7,
    status: "Reviewed"
  },
  {
    date: "2025-09-10",
    name: "Sneha Reddy",
    task: "Fixed dashboard responsiveness bugs",
    hours: 5,
    status: "Submitted"
  },
  {
    date: "2025-09-10",
    name: "Ananya Deshmukh",
    task: "Security audit on login module",
    hours: 6,
    status: "Reviewed"
  },
  {
    date: "2025-09-09",
    name: "Neha Patil",
    task: "Data cleaning & preprocessing",
    hours: 4,
    status: "Approved"
  }
];

const workLogTableBody = document.getElementById("workLogTableBody");

workLogData.forEach(log => {
  workLogTableBody.innerHTML += `
    <tr>
      <td>${log.date}</td>
      <td>${log.name}</td>
      <td>${log.task}</td>
      <td>${log.hours}</td>
      <td>
        <span class="badge ${
          log.status === "Approved"
            ? "bg-success"
            : log.status === "Reviewed"
            ? "bg-primary"
            : "bg-warning text-dark"
        }">
          ${log.status}
        </span>
      </td>
    </tr>
  `;
});


const projectProgressData = [
  {
    name: "Amit Sharma",
    project: "Intern Management Dashboard",
    progress: 75,
    phase: "Development",
    deadline: "2025-09-30"
  },
  {
    name: "Rohit Verma",
    project: "Backend API Integration",
    progress: 60,
    phase: "Development",
    deadline: "2025-10-05"
  },
  {
    name: "Sneha Reddy",
    project: "UI/UX Redesign",
    progress: 90,
    phase: "Testing",
    deadline: "2025-09-20"
  },
  {
    name: "Ananya Deshmukh",
    project: "Security & Auth Module",
    progress: 45,
    phase: "Planning",
    deadline: "2025-10-10"
  },
  {
    name: "Neha Patil",
    project: "Data Analysis Report",
    progress: 100,
    phase: "Completed",
    deadline: "2025-09-15"
  }
];

const projectProgressBody = document.getElementById("projectProgressBody");

projectProgressData.forEach(item => {
  projectProgressBody.innerHTML += `
    <tr>
      <td>${item.name}</td>
      <td>${item.project}</td>
      <td>
        <div class="progress" style="height: 8px;">
          <div class="progress-bar bg-success" 
               role="progressbar" 
               style="width: ${item.progress}%">
          </div>
        </div>
        <small>${item.progress}%</small>
      </td>
      <td>${item.phase}</td>
      <td>${item.deadline}</td>
    </tr>
  `;
});


const jiraSummaryData = [
  {
    name: "Amit Sharma",
    project: "Intern Management Dashboard",
    total: 12,
    completed: 7,
    inProgress: 3,
    pending: 2
  },
  {
    name: "Rohit Verma",
    project: "Backend API Integration",
    total: 15,
    completed: 9,
    inProgress: 4,
    pending: 2
  },
  {
    name: "Sneha Reddy",
    project: "UI/UX Redesign",
    total: 10,
    completed: 8,
    inProgress: 1,
    pending: 1
  },
  {
    name: "Ananya Deshmukh",
    project: "Security & Auth Module",
    total: 8,
    completed: 3,
    inProgress: 3,
    pending: 2
  },
  {
    name: "Neha Patil",
    project: "Data Analysis Report",
    total: 6,
    completed: 6,
    inProgress: 0,
    pending: 0
  }
];

const jiraSummaryBody = document.getElementById("jiraSummaryBody");

jiraSummaryData.forEach(item => {
  jiraSummaryBody.innerHTML += `
    <tr>
      <td>${item.name}</td>
      <td>${item.project}</td>
      <td>${item.total}</td>
      <td><span class="badge bg-success">${item.completed}</span></td>
      <td><span class="badge bg-primary">${item.inProgress}</span></td>
      <td><span class="badge bg-warning text-dark">${item.pending}</span></td>
    </tr>
  `;
});


const performanceData = [
  {
    name: "Amit Sharma",
    attendance: 92,
    completion: 85,
    rating: "4.5 / 5",
    grade: "A"
  },
  {
    name: "Rohit Verma",
    attendance: 95,
    completion: 90,
    rating: "4.7 / 5",
    grade: "A+"
  },
  {
    name: "Sneha Reddy",
    attendance: 90,
    completion: 88,
    rating: "4.4 / 5",
    grade: "A"
  },
  {
    name: "Ananya Deshmukh",
    attendance: 85,
    completion: 70,
    rating: "4.0 / 5",
    grade: "B+"
  },
  {
    name: "Neha Patil",
    attendance: 88,
    completion: 92,
    rating: "4.6 / 5",
    grade: "A"
  }
];

const performanceTableBody = document.getElementById("performanceTableBody");

performanceData.forEach(item => {
  performanceTableBody.innerHTML += `
    <tr>
      <td>${item.name}</td>
      <td>${item.attendance}%</td>
      <td>${item.completion}%</td>
      <td>${item.rating}</td>
      <td>
        <span class="badge ${
          item.grade === "A+" ? "bg-success" :
          item.grade === "A"  ? "bg-primary" :
          "bg-warning text-dark"
        }">
          ${item.grade}
        </span>
      </td>
    </tr>
  `;
});

function showReportTab(tabId) {
  document.querySelectorAll(".report-tab").forEach(tab => {
    tab.classList.add("d-none");
  });
  document.getElementById(tabId).classList.remove("d-none");
}

const attendanceReportData = [
  { name: "Amit Sharma", total: 30, present: 28, absent: 2, percent: "93%" },
  { name: "Rohit Verma", total: 30, present: 29, absent: 1, percent: "97%" },
  { name: "Sneha Reddy", total: 30, present: 27, absent: 3, percent: "90%" },
  { name: "Ananya Deshmukh", total: 30, present: 25, absent: 5, percent: "83%" }
];

const attendanceReportBody = document.getElementById("attendanceReportBody");
attendanceReportData.forEach(item => {
  attendanceReportBody.innerHTML += `
    <tr>
      <td>${item.name}</td>
      <td>${item.total}</td>
      <td>${item.present}</td>
      <td>${item.absent}</td>
      <td>${item.percent}</td>
    </tr>
  `;
});

const internshipSummaryData = [
  { name: "Amit Sharma", domain: "Web Development", status: "Active", start: "01-Aug-2025", end: "-" },
  { name: "Neha Patil", domain: "Data Science", status: "Completed", start: "01-Jun-2025", end: "31-Aug-2025" },
  { name: "Sneha Reddy", domain: "Frontend", status: "Active", start: "15-Jul-2025", end: "-" }
];

const internshipSummaryBody = document.getElementById("internshipSummaryBody");
internshipSummaryData.forEach(item => {
  internshipSummaryBody.innerHTML += `
    <tr>
      <td>${item.name}</td>
      <td>${item.domain}</td>
      <td>${item.status}</td>
      <td>${item.start}</td>
      <td>${item.end}</td>
    </tr>
  `;
});

const workLogSummaryData = [
  { name: "Amit Sharma", tasks: 18, hours: 120, updated: "10-Sep-2025" },
  { name: "Rohit Verma", tasks: 22, hours: 140, updated: "11-Sep-2025" },
  { name: "Sneha Reddy", tasks: 16, hours: 110, updated: "09-Sep-2025" }
];

const workLogSummaryBody = document.getElementById("workLogSummaryBody");
workLogSummaryData.forEach(item => {
  workLogSummaryBody.innerHTML += `
    <tr>
      <td>${item.name}</td>
      <td>${item.tasks}</td>
      <td>${item.hours}</td>
      <td>${item.updated}</td>
    </tr>
  `;
});

function showEventTab(tabId) {
  document.querySelectorAll(".event-tab").forEach(tab => {
    tab.classList.add("d-none");
  });
  document.getElementById(tabId).classList.remove("d-none");
}

const internshipOpeningsData = [
  { role: "Frontend Intern", dept: "Web Development", duration: "3 Months", stipend: "₹8,000", status: "Open" },
  { role: "Backend Intern", dept: "Software Development", duration: "6 Months", stipend: "₹10,000", status: "Open" },
  { role: "Data Science Intern", dept: "Analytics", duration: "4 Months", stipend: "₹12,000", status: "Closed" }
];

const internshipOpeningsBody = document.getElementById("internshipOpeningsBody");
internshipOpeningsData.forEach(item => {
  internshipOpeningsBody.innerHTML += `
    <tr>
      <td>${item.role}</td>
      <td>${item.dept}</td>
      <td>${item.duration}</td>
      <td>${item.stipend}</td>
      <td>
        <span class="badge ${item.status === "Open" ? "bg-success" : "bg-secondary"}">
          ${item.status}
        </span>
      </td>
    </tr>
  `;
});

const hiringDrivesData = [
  { company: "TechnoKraft", date: "20-Sep-2025", location: "Pune", domain: "Web, Software" },
  { company: "Infosys", date: "28-Sep-2025", location: "Online", domain: "Data, Cloud" }
];

const hiringDrivesBody = document.getElementById("hiringDrivesBody");
hiringDrivesData.forEach(item => {
  hiringDrivesBody.innerHTML += `
    <tr>
      <td>${item.company}</td>
      <td>${item.date}</td>
      <td>${item.location}</td>
      <td>${item.domain}</td>
    </tr>
  `;
});

const workshopsData = [
  { title: "React Basics", speaker: "Kunal Patil", date: "15-Sep-2025", mode: "Online" },
  { title: "Career in Data Science", speaker: "Industry Expert", date: "22-Sep-2025", mode: "Offline" }
];

const workshopsBody = document.getElementById("workshopsBody");
workshopsData.forEach(item => {
  workshopsBody.innerHTML += `
    <tr>
      <td>${item.title}</td>
      <td>${item.speaker}</td>
      <td>${item.date}</td>
      <td>${item.mode}</td>
    </tr>
  `;
});

const announcementsData = [
  "New internship batch starts from 1st October 2025",
  "Attendance will be reviewed weekly",
  "Final evaluations scheduled for December 2025"
];

const announcementsBody = document.getElementById("announcementsBody");
announcementsData.forEach(msg => {
  announcementsBody.innerHTML += `
    <li class="list-group-item">${msg}</li>
  `;
});
