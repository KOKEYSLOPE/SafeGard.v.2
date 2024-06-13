document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const messageForm = document.getElementById('messageForm');
    const registerContainer = document.getElementById('registerContainer');
    const scanContainer = document.getElementById('scanContainer');
    const notificationContainer = document.getElementById('notificationContainer');
    const notificationMessage = document.getElementById('notificationMessage');
    const result = document.getElementById('result');
    const emailButton = document.getElementById('emailButton');

    // Handle registration
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const mobileNumber = document.getElementById('mobileNumber').value;

        if (validateMobileNumber(mobileNumber)) {
            localStorage.setItem('registeredMobileNumber', mobileNumber);
            registerContainer.style.display = 'none';
            scanContainer.style.display = 'block';
        } else {
            alert('Please enter a valid mobile number.');
        }
    });

    // Handle message scanning
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = document.getElementById('message').value;
        const scanResult = scanMessage(message);
        
        if (scanResult.isSuspicious) {
            result.textContent = 'Warning: This message may be a phishing or scam attempt.';
            result.className = 'result danger';
            showNotification(scanResult.alertMessage);
        } else {
            result.textContent = 'This message seems safe.';
            result.className = 'result safe';
        }
    });

    // Validate mobile number (simple validation for 10 digits)
    function validateMobileNumber(mobileNumber) {
        const regex = /^[0-9]{10}$/;
        return regex.test(mobileNumber);
    }

    // Check if the user is already registered
    if (localStorage.getItem('registeredMobileNumber')) {
        registerContainer.style.display = 'none';
        scanContainer.style.display = 'block';
    }

    // Function to scan message
    function scanMessage(message) {
        // List of suspicious keywords commonly found in phishing or scam messages
        const suspiciousKeywords = [
            'urgent', 'immediate action', 'verify your account', 'click here', 'update your information', 'password', 
            'login', 'account suspended', 'security alert', 'free', 'won', 'prize', 'transfer', 'bank account'
        ];

        // List of suspicious URL patterns
        const suspiciousUrls = [
            'bit.ly', 'tinyurl.com', 'goo.gl', 'g00gle.com', 'paypal-secure.com', 'account-update.com'
        ];

        let isSuspicious = false;
        let alertMessage = 'This message contains the following suspicious content: ';

        // Check for suspicious keywords
        for (const keyword of suspiciousKeywords) {
            if (message.toLowerCase().includes(keyword)) {
                isSuspicious = true;
                alertMessage += `keyword "${keyword}", `;
            }
        }

        // Check for suspicious URLs
        for (const url of suspiciousUrls) {
            if (message.toLowerCase().includes(url)) {
                isSuspicious = true;
                alertMessage += `URL "${url}", `;
            }
        }

        if (isSuspicious) {
            alertMessage = alertMessage.slice(0, -2) + '.';
        }

        return { isSuspicious, alertMessage };
    }

    // Function to show notification
    function showNotification(alertMessage) {
        notificationMessage.textContent = alertMessage;
        notificationContainer.style.display = 'block';
    }

    // Handle notification acknowledgment
    document.getElementById('acknowledgeButton').addEventListener('click', function() {
        notificationContainer.style.display = 'none';
    });

    // Handle email button click
    emailButton.addEventListener('click', function() {
        const alertMessage = notificationMessage.textContent;
        window.location.href = `mailto:?subject=Phishing Alert&body=${encodeURIComponent(alertMessage)}`;
    });
});
