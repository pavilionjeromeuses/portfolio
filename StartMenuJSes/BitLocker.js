// BitLocker.js
function openBitLocker() {
    const bitlockerContent = `
        <div class="bitlocker-app">
            <div class="mb-3">
                <h4>🔒 Fake Drive Encryption</h4>
                <select id="drive-select" class="form-control mb-2" style="border-style: inset;">
                    <option>📀 Local Disk (C:)</option>
                    <option>💾 Floppy Disk (A:)</option>
                    <option>🎮 Xbox Virtual Drive (X:)</option>
                    <option>👾 Alien Technology Partition</option>
                </select>
            </div>

            <div class="encryption-controls">
                <div class="password-input mb-3">
                    <input type="password" id="encryption-password" 
                           class="form-control" 
                           placeholder="Enter funny password" 
                           style="border-style: inset;">
                    <div id="password-strength" class="mt-1"></div>
                </div>

                <div class="mb-3">
                    <label>Encryption Type:</label>
                    <div class="btn-group">
                        <button class="btn btn-secondary active" data-type="basic">Basic (Meme Encryption)</button>
                        <button class="btn btn-secondary" data-type="advanced">Advanced (Emoji Cipher)</button>
                    </div>
                </div>

                <button class="btn btn-warning w-100 mb-3" 
                        onclick="startFakeEncryption()"
                        style="border: 2px solid #808080;">
                    🚀 Encrypt Now!
                </button>

                <div id="encryption-progress" style="display: none;">
                    <div class="progress mb-2" style="height: 20px; border: 2px inset #808080;">
                        <div id="progress-bar" class="progress-bar" 
                             role="progressbar" 
                             style="width: 0%; background-color: #000080;"></div>
                    </div>
                    <div id="progress-text" class="text-center"></div>
                </div>

                <div id="encryption-result" class="mt-3 p-2" style="display: none;"></div>
            </div>
        </div>
    `;

    createWindow('bitlocker', 'FakeLocker Drive Encryption', bitlockerContent);
    initializeBitLockerEvents();
}

function initializeBitLockerEvents() {
    // Password strength checker
    document.getElementById('encryption-password').addEventListener('input', function(e) {
        const strength = calculatePasswordStrength(e.target.value);
        const strengthElement = document.getElementById('password-strength');
        strengthElement.innerHTML = getHumorousStrengthFeedback(strength);
    });

    // Encryption type switcher
    document.querySelectorAll('[data-type]').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length > 0) strength += 25;
    if (password.length > 5) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[!@#$%^&*]/.test(password)) strength += 25;
    return Math.min(strength, 100);
}

function getHumorousStrengthFeedback(strength) {
    const messages = [
        { threshold: 0, text: "🦔 Security level: Rolling Hedgehog", class: "text-danger" },
        { threshold: 25, text: "🐌 Slower than Windows Update", class: "text-warning" },
        { threshold: 50, text: "🔑 Better than 'password123'", class: "text-info" },
        { threshold: 75, text: "🛡️ Stronger than Windows 95 security!", class: "text-primary" },
        { threshold: 100, text: "🚀 NASA-level encryption!", class: "text-success" }
    ];
    
    return messages.reverse().find(m => strength >= m.threshold).text;
}

function startFakeEncryption() {
    const password = document.getElementById('encryption-password').value;
    if (password.length < 4) {
        alert("⚠️ Password must contain at least 4 memes!");
        return;
    }

    const progressElement = document.getElementById('encryption-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const resultElement = document.getElementById('encryption-result');

    progressElement.style.display = 'block';
    let progress = 0;

    const fakeSteps = [
        "Initializing hamster wheel...",
        "Polishing encryption crystals...",
        "Teaching AI about blockchain...",
        "Downloading more RAM...",
        "Reversing polarity...",
        "Consulting magic 8-ball...",
        "Asking ChatGPT for help..."
    ];

    const interval = setInterval(() => {
        progress += Math.random() * 5;
        progress = Math.min(progress, 100);
        progressBar.style.width = `${progress}%`;
        
        const currentStep = fakeSteps[Math.floor((progress/100) * (fakeSteps.length - 1))];
        progressText.innerHTML = `${currentStep} (${Math.floor(progress)}%)`;

        if (progress >= 100) {
            clearInterval(interval);
            resultElement.style.display = 'block';
            resultElement.innerHTML = `
                <div class="alert alert-success" style="background: #c0c0c0; border: 2px inset #808080;">
                    <h4>✅ Encryption Complete!</h4>
                    <p>Your drive is now protected with:</p>
                    <ul>
                        <li>${Math.floor(Math.random() * 1000)} meme-based encryption layers</li>
                        <li>${Math.floor(Math.random() * 100)}% quantum resistance</li>
                        <li>Automatic cat picture decoy system</li>
                    </ul>
                    <div id="decrypt-warning" class="mt-2 text-danger"></div>
                </div>
            `;
            startDecryptionCountdown();
        }
    }, 300);
}

function startDecryptionCountdown() {
    let timeLeft = 15;
    const warningElement = document.getElementById('decrypt-warning');
    
    const countdown = setInterval(() => {
        warningElement.innerHTML = `
            ⚠️ Self-destruct sequence initiated: ${timeLeft}s 
            <button onclick="resetCountdown()" class="btn btn-sm btn-danger">
                😱 Cancel!
            </button>
        `;
        
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(countdown);
            warningElement.innerHTML = "💥 BOOM! Just kidding. Your data is safe(ly encrypted)!";
        }
    }, 1000);
}

window.resetCountdown = () => {
    document.getElementById('decrypt-warning').innerHTML = 
        "🚨 Countdown reset! Encryption remains active until Windows 95 support ends.";
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .bitlocker-app {
            background: #c0c0c0;
            padding: 15px;
        }
        .progress {
            background-color: #ffffff;
            border-radius: 0;
        }
        .form-control {
            background: white;
            border-radius: 0;
            border: 2px inset #808080;
        }
        .btn-secondary.active {
            background-color: #000080;
            color: white;
        }
    `;
    document.head.appendChild(style);
});