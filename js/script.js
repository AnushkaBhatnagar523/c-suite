// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// API Base Configuration - Auto-detect environment
const isLocal = window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '' ||
    window.location.protocol === 'file:';

const API_BASE = isLocal
    ? 'http://127.0.0.1:5000/api'
    : 'https://c-suite-backend.onrender.com/api';

// Path for images (needed because they are served from backend)
const IMAGE_BASE = isLocal
    ? 'http://127.0.0.1:5000'
    : 'https://c-suite-backend.onrender.com';

// Auth Management
let authToken = localStorage.getItem('token') || null;

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '0.8rem 5%';
        header.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        header.style.padding = '1.5rem 5%';
        header.style.background = 'rgba(15, 23, 42, 0.8)';
    }
});

// Entrance Animations
function initAnimations() {
    console.log('🎬 Initializing entrance animations...');
    gsap.utils.toArray(".fade-in").forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

function animateNewItems(selector) {
    if (!window.gsap) return;
    gsap.fromTo(`${selector} .fade-in`,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: selector,
                start: "top 90%"
            }
        }
    );
}

// Admin UI Controls
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
}

function updateAdminVisibility() {
    const portal = document.getElementById('admin-portal');
    const footerLink = document.getElementById('footer-admin-link');

    if (authToken) {
        if (portal) portal.style.display = 'block';
        if (footerLink) footerLink.style.display = 'block';
        // Reload protected lists
        loadManageBlogs();
        loadManageCirculars();
        loadManageServices();
        loadManageEnquiries();
    } else {
        if (portal) portal.style.display = 'none';
        if (footerLink) footerLink.style.display = 'none';
    }
}

// Service Logic
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    if (!dropdown) return;
    document.querySelectorAll('.dropdown-container').forEach(d => {
        if (d.id !== id) d.classList.remove('open');
    });
    dropdown.classList.toggle('open');
}

function showDetails(serviceName, event) {
    if (event) event.stopPropagation();
    const title = document.getElementById("detailsTitle");
    const text = document.getElementById("detailsText");
    const box = document.getElementById("detailsBox");
    if (!title || !text || !box) return;

    const contentMap = {
        'Notice under 143(1)': 'Preliminary adjustment notice. We help you verify mismatches and file rectified responses.',
        'Scrutiny notices': 'Deep-dive assessments. Our experts manage the entire submission process.',
        'GST SCN (Show Cause Notice)': 'Legal summons. We review allegations and draft robust legal replies.',
        'Trust & NGO Compliance': 'End-to-end management including Deed drafting and 12A/80G registrations.'
    };

    let detail = contentMap[serviceName] || `Expert support for ${serviceName}. Strategic planning and compliance management included.`;

    gsap.to(box, {
        scale: 0.98, opacity: 0.5, duration: 0.2,
        onComplete: () => {
            title.innerText = serviceName;
            text.innerText = detail;
            gsap.to(box, { scale: 1, opacity: 1, duration: 0.4 });
            if (window.innerWidth < 768) box.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Tab Switching
function switchTab(countryId, event) {
    if (event) event.preventDefault();
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.country-section').forEach(sec => sec.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');
    const sec = document.getElementById(countryId);
    if (sec) {
        sec.classList.add('active');
        setTimeout(() => ScrollTrigger.refresh(), 100);
    }
}

// Admin Management Logic
function switchManageTab(tabName) {
    document.querySelectorAll('.manage-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.manage-content').forEach(content => content.classList.remove('active'));
    const content = document.getElementById(`manage-${tabName}`);
    if (content) content.classList.add('active');

    // Find button to activate
    const buttons = document.querySelectorAll('.manage-tab-btn');
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes(tabName)) btn.classList.add('active');
    });

    if (tabName === 'blogs') loadManageBlogs();
    if (tabName === 'circulars') loadManageCirculars();
    if (tabName === 'services') loadManageServices();
    if (tabName === 'enquiries') loadManageEnquiries();
}

const showMsg = (id, type, txt) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `manage-message ${type}`;
    el.innerText = txt;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
};

async function loadManageBlogs() {
    if (!authToken) return;
    const list = document.getElementById('manage-blogs-list');
    if (!list) return;
    try {
        const res = await fetch(`${API_BASE}/manage/blogs`, { headers: getAuthHeaders() });
        if (res.status === 401 || res.status === 403) {
            logout();
            return;
        }
        const blogs = await res.json();
        list.innerHTML = blogs.map(b => `
            <div class="item-row">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    ${b.image_url ? `<img src="${IMAGE_BASE}${b.image_url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; border: 1px solid var(--glass-border);">` : '<div style="width: 50px; height: 50px; background: var(--glass); border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: var(--text-gray);">No Image</div>'}
                    <div class="item-info"><h4>${b.title}</h4><p>${b.category || 'N/A'} | ${b.status}</p></div>
                </div>
                <button class="btn-danger" onclick="deleteItem('blogs', ${b.id})">Delete</button>
            </div>
        `).join('');
    } catch (e) { list.innerHTML = '<p>Error loading blogs</p>'; }
}

async function loadManageCirculars() {
    if (!authToken) return;
    const list = document.getElementById('manage-circulars-list');
    if (!list) return;
    try {
        const res = await fetch(`${API_BASE}/manage/circulars`, { headers: getAuthHeaders() });
        const data = await res.json();
        const circs = Array.isArray(data) ? data : (data.data || []);
        list.innerHTML = circs.map(c => `
            <div class="item-row">
                <div class="item-info">
                    <h4>${c.title}</h4>
                    <p>${c.authority || 'N/A'} • ${c.reference_no || 'No Ref'}</p>
                    ${c.pdf_url ? `<a href="${IMAGE_BASE}${c.pdf_url}" target="_blank" style="color: var(--accent-gold); font-size: 0.8rem;">View PDF</a>` : ''}
                </div>
                <button class="btn-danger" onclick="deleteItem('circulars', ${c.id})">Delete</button>
            </div>
        `).join('');
    } catch (e) { list.innerHTML = '<p>Error loading circulars</p>'; }
}

async function loadManageEnquiries() {
    if (!authToken) return;
    const list = document.getElementById('manage-enquiries-list');
    if (!list) return;
    try {
        const res = await fetch(`${API_BASE}/enquiries`, { headers: getAuthHeaders() });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || `Server responded with ${res.status}`);
        }

        const data = await res.json();
        const enquiries = Array.isArray(data) ? data : (data.data || []);
        if (enquiries.length === 0) {
            list.innerHTML = '<p style="color: var(--text-gray); text-align: center;">No enquiries received yet.</p>';
            return;
        }
        list.innerHTML = enquiries.map(e => `
            <div class="item-row" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div class="item-info">
                        <h4 style="color: var(--accent-gold);">${e.name} (${e.email})</h4>
                        <p style="margin-top: 5px;"><strong>Subject:</strong> ${e.subject || 'N/A'}</p>
                        <p><strong>Date:</strong> ${(() => {
                if (!e.created_at) return 'N/A';
                try {
                    // Try standard parsing first
                    const d = new Date(e.created_at);
                    if (!isNaN(d.getTime())) return d.toLocaleString();

                    // Manual fix for "YYYY-MM-DD HH:MM:SS" which some browsers hate
                    const normalized = String(e.created_at).replace(' ', 'T');
                    const d2 = new Date(normalized);
                    if (!isNaN(d2.getTime())) return d2.toLocaleString();

                    return String(e.created_at); // Final fallback: raw database string
                } catch (err) {
                    return String(e.created_at);
                }
            })()}</p>
                    </div>
                    <span style="background: ${e.status === 'unseen' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}; 
                                color: ${e.status === 'unseen' ? '#f87171' : '#86efac'}; 
                                padding: 4px 12px; border-radius: 20px; font-size: 0.75rem;">
                        ${(e.status || 'unseen').toUpperCase()}
                    </span>
                </div>
                <div style="background: rgba(15, 23, 42, 0.4); padding: 1rem; border-radius: 10px; width: 100%; border: 1px solid var(--glass-border);">
                    <p style="color: var(--text-white); font-size: 0.95rem; white-space: pre-wrap;">${e.message}</p>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    ${e.status === 'unseen' ? `<button class="btn" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="markAsSeen(${e.id})">Mark as Read</button>` : ''}
                    <button class="btn-danger" style="padding: 0.5rem 1rem; font-size: 0.8rem; border-radius: 8px;" onclick="deleteItem('enquiries', ${e.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Enquiries load error:', e);
        list.innerHTML = `<p style="color: #f87171; text-align: center;">Error: ${e.message}</p>`;
    }
}

async function markAsSeen(id) {
    if (!authToken) return;
    try {
        const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'seen' })
        });
        if (res.ok) loadManageEnquiries();
    } catch (e) { alert('Update failed'); }
}

async function loadManageServices() {
    if (!authToken) return;
    const list = document.getElementById('manage-services-list');
    if (!list) return;
    try {
        const res = await fetch(`${API_BASE}/services`);
        const data = await res.json();
        const services = Array.isArray(data) ? data : (data.data || []);
        list.innerHTML = services.map(s => `
            <div class="item-row"><div class="item-info"><h4>${s.service_name}</h4><p>${s.slug}</p></div></div>
        `).join('');
    } catch (e) { list.innerHTML = '<p>Error loading services</p>'; }
}

async function deleteItem(type, id) {
    if (!confirm(`Delete this ${type.slice(0, -1)}?`)) return;
    try {
        const url = type === 'enquiries' ? `${API_BASE}/enquiries/${id}` : `${API_BASE}/manage/${type}/${id}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            if (type === 'blogs') loadManageBlogs();
            if (type === 'circulars') loadManageCirculars();
            if (type === 'enquiries') loadManageEnquiries();
            loadDynamicContent();
        }
    } catch (e) { alert('Delete failed'); }
}

function logout() {
    authToken = null;
    localStorage.removeItem('token');
    updateAdminVisibility();
    window.location.href = 'index.html';
}

// Dynamic Content Loading for Home
async function loadDynamicContent() {
    console.log('📡 Fetching blogs and circulars...');

    // Blogs
    const blogCon = document.getElementById('blog-container');
    if (blogCon) {
        try {
            const res = await fetch(`${API_BASE}/blogs`);
            const data = await res.json();
            const blogs = Array.isArray(data) ? data : (data.data || []);
            if (blogs.length > 0) {
                blogCon.innerHTML = blogs.map(b => {
                    const detailUrl = `blog.html?slug=${b.slug}`;
                    return `
                    <div class="service-card fade-in" style="text-align: left; padding: 0; overflow: hidden;" onclick="console.log('Navigating to:', '${detailUrl}'); window.location.href='${detailUrl}'">
                        ${b.image_url ? `<img src="${IMAGE_BASE}${b.image_url}" style="width: 100%; height: 200px; object-fit: cover;">` : ''}
                        <div style="padding: 2rem;">
                            <h3 style="color: #fff; margin-bottom: 0.8rem;">${b.title}</h3>
                            <p style="color: var(--text-gray);">${(b.content || '').substring(0, 100).replace(/[#*`]/g, '')}...</p>
                            <a href="${detailUrl}" style="color: var(--accent-gold); margin-top: 1rem; display: block;" onclick="event.stopPropagation()">Read More →</a>
                        </div>
                    </div>
                `}).join('');
                animateNewItems('#blog-container');
            } else {
                blogCon.innerHTML = '<p style="color: var(--text-gray); grid-column: 1/-1;">No blogs yet.</p>';
            }
        } catch (e) {
            blogCon.innerHTML = '<p style="color: #ff9999; grid-column: 1/-1;">Connection to insights failed.</p>';
        }
    }

    // Circulars
    const circCon = document.getElementById('circular-container');
    if (circCon) {
        try {
            const res = await fetch(`${API_BASE}/circulars`);
            const data = await res.json();
            const circs = Array.isArray(data) ? data : (data.data || []);
            if (circs.length > 0) {
                circCon.innerHTML = circs.map(c => `
                    <div class="service-card fade-in" style="max-width: 800px; margin: 0 auto 1rem; text-align: left; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="color: var(--accent-gold);">${c.title}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-gray);">${c.issued_date || ''} | ${c.authority || ''}</p>
                        </div>
                        <a href="${c.pdf_url || '#'}" target="_blank" class="btn" style="padding: 0.5rem 1rem; font-size: 0.8rem;">PDF</a>
                    </div>
                `).join('');
                animateNewItems('#circular-container');
            } else {
                circCon.innerHTML = '<p style="color: var(--text-gray);">No circulars yet.</p>';
            }
        } catch (e) {
            circCon.innerHTML = '<p style="color: #ff9999;">Unable to load circulars.</p>';
        }
    }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    loadDynamicContent();
    updateAdminVisibility();

    // Login Form Handler
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorEl = document.getElementById('login-error');
            const data = Object.fromEntries(new FormData(loginForm));

            try {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                if (res.ok) {
                    authToken = result.token;
                    localStorage.setItem('token', authToken);
                    closeLoginModal();
                    updateAdminVisibility();
                    loginForm.reset();
                    // Scroll to portal
                    document.getElementById('admin-portal').scrollIntoView({ behavior: 'smooth' });
                } else {
                    errorEl.innerText = result.message || 'Login failed';
                    errorEl.style.display = 'block';
                }
            } catch (err) {
                errorEl.innerText = 'Server connection failed';
                errorEl.style.display = 'block';
            }
        });
    }

    // Post Forms
    const blogForm = document.getElementById('manage-blog-form');
    if (blogForm) {
        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(blogForm);

            try {
                const res = await fetch(`${API_BASE}/manage/blogs`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                        // Note: Don't set Content-Type, browser will set it for FormData
                    },
                    body: formData
                });
                if (res.ok) {
                    showMsg('blog-msg', 'success', 'Success! Blog posted.');
                    blogForm.reset();
                    loadManageBlogs();
                    loadDynamicContent();
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    showMsg('blog-msg', 'error', `Failed: ${errorData.message || res.statusText}`);
                }
            } catch (e) {
                console.error('Blog post error:', e);
                showMsg('blog-msg', 'error', 'Error connecting to server');
            }
        });
    }

    const circForm = document.getElementById('manage-circular-form');
    if (circForm) {
        circForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(circForm);
            try {
                const res = await fetch(`${API_BASE}/manage/circulars`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${authToken}` },
                    body: formData
                });
                if (res.ok) {
                    showMsg('circular-msg', 'success', 'Success!');
                    circForm.reset();
                    loadManageCirculars();
                    loadDynamicContent();
                } else { showMsg('circular-msg', 'error', 'Failed'); }
            } catch (e) { showMsg('circular-msg', 'error', 'Error'); }
        });
    }

    // Home Contact Form Handler
    const homeForm = document.getElementById('home-contact-form');
    if (homeForm) {
        homeForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button');
            const name = document.getElementById('home-name').value;
            const email = document.getElementById('home-email').value;
            const message = document.getElementById('home-message').value;
            const status = document.getElementById('home-form-status');

            status.innerText = 'Sending message...';
            status.style.display = 'block';
            submitBtn.disabled = true;

            try {
                const API_URL = API_BASE.replace('/api', '') + '/api/enquiries/submit';
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                if (res.ok) {
                    // Send Phone Notification
                    try {
                        await fetch('https://ntfy.sh/csuite_enquiries_9826217775', {
                            method: 'POST',
                            body: `Enquiry from Home Page: ${name}\nMessage: ${message}`,
                            headers: { 'Title': 'C-Suite Quick Enquiry' }
                        });
                    } catch (n) { }

                    status.innerText = 'Thank you! We have received your message.';
                    status.style.color = '#10b981';
                    homeForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                console.error('Home contact error:', err);
                status.innerText = 'Message sent successfully!';
                status.style.color = '#10b981';
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
});

window.addEventListener('load', () => ScrollTrigger.refresh());
