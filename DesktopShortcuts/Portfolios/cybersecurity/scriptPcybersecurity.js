const alertsData = [
    { type: 'success', icon: '✅', message: '[SecureCheck] Password Health Auditor' },
    { type: 'info', icon: 'ℹ️', message: "[CyberWiki] Interactive Vulnerability Database" },
    { type: 'warning', icon: '⚠️', message: "[ThreatBloom] Real-Time Phishing Detector" },
    { type: 'error', icon: '❌', message: "[BlockShield] Firewall Rule Generator" },
    { type: 'neutral', icon: '💜', message: "[MedGuard] HIPAA Compliance Scanner" },
    { type: 'light-warning', icon: '🌸', message: "[Petals] Social Media Privacy Analyzer" }
];

const alertContainer = document.getElementById('alert-container');
let index = 0;

function showAlert() {
    if (index >= alertsData.length) {
        index = 0; 
    }
    
    const alertInfo = alertsData[index];
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', alertInfo.type);
    alertDiv.innerHTML = `
        <span>${alertInfo.icon}</span>
        ${alertInfo.message}
        <div class="loader"></div>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    document.querySelectorAll('.doc-alert').forEach(doc => {
        doc.classList.remove('highlight');
        if (doc.classList.contains(alertInfo.type)) {
            doc.classList.add('highlight');
        }
    });
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            alertDiv.remove();
            index++;
            showAlert();
        }, 500);
    }, 1500);
}

showAlert();