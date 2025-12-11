/* ========================================
   FLAMES & FLAVOUR - Premium Steakhouse
   JavaScript Functionality with VAPI Integration
   ======================================== */

// VAPI Configuration - GET YOUR PUBLIC KEY FROM: https://dashboard.vapi.ai/account
const VAPI_PUBLIC_KEY = '49fdb7a2-f2c0-4313-9992-98b16767be5a'; //  REPLACE THIS with your actual VAPI public key
const VAPI_ASSISTANT_ID = '43cae01e-2cfa-49c5-826c-dd22519399de';

// Global VAPI instance
let vapiInstance = null;
let isCallActive = false;
let vapiReady = false;
let emailAlreadySent = false; // Flag to prevent keyboard showing again

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality immediately
    initPreloader();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    
    // Attach button handlers immediately
    attachButtonHandlers();
    
    // Initialize VAPI quickly
    setTimeout(initVAPI, 300);
});

/* ========================================
   PRELOADER
   ======================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    // Hide preloader quickly
    setTimeout(function() {
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }, 500); // Reduced from 1500ms to 500ms
}

/* ========================================
   NAVBAR
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Click handler for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Global function for buttons
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.about-content, .about-visual, .menu-card, .reservations-content, .reservations-visual, .voice-feature, .step'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Add CSS for scroll animations dynamically
    addScrollAnimationStyles();
}

function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .menu-card.animate-on-scroll {
            transition-delay: calc(var(--card-index, 0) * 0.1s);
        }
        
        .step.animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
        .step.animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
        .step.animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
    
    // Add card index for staggered animation
    document.querySelectorAll('.menu-card').forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
}

/* ========================================
   VAPI VOICE AI INTEGRATION
   ======================================== */
function initVAPI() {
    // Check if public key is configured
    if (VAPI_PUBLIC_KEY === 'YOUR_VAPI_PUBLIC_KEY_HERE' || !VAPI_PUBLIC_KEY) {
        console.warn('⚠️ VAPI Public Key not configured! Please add your key in script.js');
        console.log('📋 Get your public key from: https://dashboard.vapi.ai/account');
        vapiReady = false;
        attachButtonHandlers();
        return;
    }
    
    // Check for VAPI in different ways (SDK loads differently via ES module)
    let VapiClass = window.Vapi;
    
    // Handle ES module default export
    if (VapiClass && VapiClass.default) {
        VapiClass = VapiClass.default;
    }
    
    console.log('🔍 VAPI Check - Type:', typeof VapiClass, 'Value:', VapiClass);
    
    if (VapiClass && typeof VapiClass === 'function') {
        try {
            vapiInstance = new VapiClass(VAPI_PUBLIC_KEY);
            vapiReady = true;
            console.log('✅ VAPI initialized successfully');
            setupVAPIEventListeners();
        } catch (error) {
            console.error('Failed to initialize VAPI:', error);
            vapiReady = false;
        }
    } else {
        // Retry after 500ms, max 5 attempts (faster retries)
        if (!window.vapiRetryCount) window.vapiRetryCount = 0;
        window.vapiRetryCount++;
        
        if (window.vapiRetryCount < 5) {
            setTimeout(initVAPI, 500);
            return;
        } else {
            console.log('ℹ️ VAPI will initialize on first call');
            vapiReady = false;
        }
    }
    
    attachButtonHandlers();
}

function setupVAPIEventListeners() {
    if (!vapiInstance) return;
    
    vapiInstance.on('call-start', () => {
        console.log('📞 Call started');
        isCallActive = true;
        emailAlreadySent = false; // Reset flag for new call
        updateUIForActiveCall();
        showNotification('Connected! Start speaking to book your table.', 'success');
    });
    
    vapiInstance.on('call-end', () => {
        console.log('📞 Call ended');
        isCallActive = false;
        updateUIForInactiveCall();
        showNotification('Call ended. Thank you!', 'info');
    });
    
    vapiInstance.on('speech-start', () => {
        console.log('🎙️ Assistant speaking...');
    });
    
    vapiInstance.on('speech-end', () => {
        console.log('🎙️ Assistant stopped speaking');
    });
    
    vapiInstance.on('error', (error) => {
        console.error('❌ VAPI Error:', error);
        isCallActive = false;
        updateUIForInactiveCall();
        showNotification('Connection error. Please try again.', 'error');
    });

    // Listen for transcripts to detect when agent asks for email
    vapiInstance.on('message', (message) => {
        console.log('💬 Message:', message);
        
        // Check if it's a transcript message from the assistant
        if (message.type === 'transcript' && message.role === 'assistant') {
            checkForEmailRequest(message.transcript);
        }
        
        // Also check conversation updates
        if (message.type === 'conversation-update' && message.conversation) {
            const lastMessage = message.conversation[message.conversation.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
                checkForEmailRequest(lastMessage.content);
            }
        }
    });
}

function attachButtonHandlers() {
    // Attach click handlers to all voice booking buttons
    const voiceButtons = [
        document.getElementById('heroVoiceBtn'),
        document.getElementById('voiceCta'),
        document.getElementById('navBookBtn'),
        document.getElementById('floatingVoiceBtn'),
        document.getElementById('footerVoiceBtn')
    ];
    
    voiceButtons.forEach(btn => {
        if (btn) {
            // Remove existing listeners to prevent duplicates
            btn.removeEventListener('click', handleVoiceButtonClick);
            btn.addEventListener('click', handleVoiceButtonClick);
        }
    });
    
    // Initialize keyboard input panel handlers
    initKeyboardPanel();
    
    console.log('✅ Voice buttons initialized');
}

/* ========================================
   KEYBOARD INPUT PANEL
   ======================================== */

// Keywords that trigger the email keyboard popup
const EMAIL_KEYWORDS = [
    'email',
    'e-mail',
    'email address',
    'e-mail address',
    'your email',
    'provide email',
    'send confirmation',
    'confirmation email',
    'what is your email',
    'may i have your email',
    'can i get your email'
];

function checkForEmailRequest(transcript) {
    if (!transcript) return;
    
    // Don't show keyboard again if email was already sent
    if (emailAlreadySent) {
        console.log('📧 Email already sent, ignoring keyword');
        return;
    }
    
    const lowerTranscript = transcript.toLowerCase();
    
    // Check if any email keyword is mentioned
    const emailMentioned = EMAIL_KEYWORDS.some(keyword => 
        lowerTranscript.includes(keyword)
    );
    
    if (emailMentioned) {
        console.log('📧 Email request detected! Showing keyboard...');
        showKeyboardPanel();
        showNotification('💡 Type your email below for accuracy!', 'info');
    }
}

function showKeyboardPanel() {
    const keyboardPanel = document.getElementById('keyboardPanel');
    if (keyboardPanel) {
        keyboardPanel.classList.add('active');
        keyboardPanel.classList.remove('minimized');
        
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('userTextInput');
            if (input) input.focus();
        }, 300);
    }
}

function hideKeyboardPanel() {
    const keyboardPanel = document.getElementById('keyboardPanel');
    if (keyboardPanel) {
        keyboardPanel.classList.remove('active');
    }
}

function initKeyboardPanel() {
    const panel = document.getElementById('keyboardPanel');
    const minimizeBtn = document.getElementById('minimizePanel');
    const sendBtn = document.getElementById('sendTextBtn');
    const textInput = document.getElementById('userTextInput');
    const endCallBtn = document.getElementById('endCallBtn');
    const quickBtns = document.querySelectorAll('.quick-btn');
    
    if (!panel) return;
    
    // Minimize button
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            panel.classList.toggle('minimized');
            minimizeBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
        });
    }
    
    // Send button
    if (sendBtn && textInput) {
        sendBtn.addEventListener('click', () => {
            sendTextToAssistant(textInput.value);
        });
        
        // Enter key to send
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendTextToAssistant(textInput.value);
            }
        });
    }
    
    // Quick action buttons (email domains)
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-text');
            if (textInput) {
                textInput.value += text;
                textInput.focus();
            }
        });
    });
    
    // End call button
    if (endCallBtn) {
        endCallBtn.addEventListener('click', () => {
            endVAPICall();
        });
    }
}

function sendTextToAssistant(text) {
    if (!text || !text.trim()) {
        showNotification('Please enter some text to send.', 'warning');
        return;
    }
    
    text = text.trim();
    
    if (vapiInstance && isCallActive) {
        try {
            // Format the message naturally so assistant continues conversation
            // If it looks like an email, wrap it in a natural sentence
            let messageToSend = text;
            if (text.includes('@')) {
                messageToSend = `My email address is ${text}`;
            }
            
            // Send message to VAPI assistant
            vapiInstance.send({
                type: 'add-message',
                message: {
                    role: 'user',
                    content: messageToSend
                }
            });
            
            console.log('📤 Sent to assistant:', messageToSend);
            showNotification(`Email sent!`, 'success');
            
            // Mark email as sent so keyboard doesn't pop up again
            emailAlreadySent = true;
            
            // Clear input
            const textInput = document.getElementById('userTextInput');
            if (textInput) {
                textInput.value = '';
            }
            
            // Hide keyboard panel immediately after sending
            hideKeyboardPanel();
            
        } catch (error) {
            console.error('Failed to send message:', error);
            showNotification('Failed to send. Please say it instead.', 'error');
        }
    } else {
        showNotification('No active call. Please start a call first.', 'warning');
    }
}

function handleVoiceButtonClick(e) {
    e.preventDefault();
    
    if (isCallActive) {
        // End the call
        endVAPICall();
    } else {
        // Start the call
        startVAPICall();
    }
}

async function startVAPICall() {
    // Check if public key is configured
    if (VAPI_PUBLIC_KEY === 'YOUR_VAPI_PUBLIC_KEY_HERE' || !VAPI_PUBLIC_KEY) {
        showNotification('⚠️ Please configure your VAPI public key in script.js', 'error');
        console.error('⚠️ VAPI Public Key not set!');
        return;
    }
    
    // Try to reinitialize if not ready
    if (!vapiInstance || !vapiReady) {
        showNotification('Initializing voice service...', 'info');
        
        // Try to create instance now - check multiple ways
        let VapiClass = window.Vapi;
        
        // If Vapi is a module with default export
        if (VapiClass && VapiClass.default) {
            VapiClass = VapiClass.default;
        }
        
        console.log('🔍 Checking VAPI availability:', typeof VapiClass);
        
        if (VapiClass && typeof VapiClass === 'function') {
            try {
                vapiInstance = new VapiClass(VAPI_PUBLIC_KEY);
                vapiReady = true;
                setupVAPIEventListeners();
                console.log('✅ VAPI initialized on demand');
            } catch (e) {
                console.error('Failed to initialize VAPI:', e);
                showNotification('Voice service error. Please refresh the page.', 'error');
                return;
            }
        } else {
            console.log('⏳ VAPI not available yet. window.Vapi =', window.Vapi);
            showNotification('Voice service is loading. Please wait 2 seconds and try again.', 'warning');
            // Try to reinit
            setTimeout(initVAPI, 1000);
            return;
        }
    }
    
    try {
        // Show connecting state
        showNotification('Connecting to Flames & Flavour assistant...', 'info');
        console.log('🔄 Starting VAPI call with assistant:', VAPI_ASSISTANT_ID);
        
        // Start the call with the assistant ID
        await vapiInstance.start(VAPI_ASSISTANT_ID);
        
    } catch (error) {
        console.error('Failed to start VAPI call:', error);
        isCallActive = false;
        updateUIForInactiveCall();
        
        const errorMsg = error.message || error.toString();
        console.error('Error details:', errorMsg);
        
        if (errorMsg.toLowerCase().includes('microphone') || errorMsg.toLowerCase().includes('permission') || errorMsg.toLowerCase().includes('denied')) {
            showNotification('Please allow microphone access to use voice booking.', 'error');
        } else if (errorMsg.toLowerCase().includes('not found') || errorMsg.toLowerCase().includes('404')) {
            showNotification('Assistant configuration error. Please contact support.', 'error');
        } else {
            showNotification('Connection failed. Please try again.', 'error');
        }
    }
}

function endVAPICall() {
    if (vapiInstance && isCallActive) {
        vapiInstance.stop();
        showNotification('Call ended. Thank you!', 'info');
    }
}

function updateUIForActiveCall() {
    document.body.classList.add('vapi-active');
    
    const floatingBtn = document.getElementById('floatingVoiceBtn');
    if (floatingBtn) {
        floatingBtn.classList.add('active');
        floatingBtn.querySelector('.floating-icon').textContent = '📞';
        floatingBtn.title = 'End Call';
    }
    
    // Update other buttons
    const voiceCta = document.getElementById('voiceCta');
    if (voiceCta) {
        voiceCta.querySelector('.cta-main').textContent = 'End Voice Call';
        voiceCta.style.background = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
    }
    
    // DON'T show keyboard panel here - it will show when agent asks for email
    // The panel is triggered by checkForEmailRequest()
}

function updateUIForInactiveCall() {
    document.body.classList.remove('vapi-active');
    
    const floatingBtn = document.getElementById('floatingVoiceBtn');
    if (floatingBtn) {
        floatingBtn.classList.remove('active');
        floatingBtn.querySelector('.floating-icon').textContent = '🎙️';
        floatingBtn.title = 'Book via Voice AI';
    }
    
    // Update other buttons
    const voiceCta = document.getElementById('voiceCta');
    if (voiceCta) {
        voiceCta.querySelector('.cta-main').textContent = 'Start Voice Booking';
        voiceCta.style.background = '';
    }
    
    // Hide keyboard input panel
    const keyboardPanel = document.getElementById('keyboardPanel');
    if (keyboardPanel) {
        keyboardPanel.classList.remove('active');
    }
}

/* ========================================
   NOTIFICATION SYSTEM
   ======================================== */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.vapi-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `vapi-notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already added
    addNotificationStyles();
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        default: return 'ℹ';
    }
}

function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .vapi-notification {
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            padding: 1rem 2rem;
            background: rgba(26, 22, 19, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 50px;
            border: 1px solid rgba(212, 168, 85, 0.3);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10002;
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        .vapi-notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        
        .vapi-notification.success {
            border-color: rgba(76, 175, 80, 0.5);
        }
        
        .vapi-notification.success .notification-icon {
            color: #4caf50;
        }
        
        .vapi-notification.error {
            border-color: rgba(244, 67, 54, 0.5);
        }
        
        .vapi-notification.error .notification-icon {
            color: #f44336;
        }
        
        .vapi-notification.warning {
            border-color: rgba(255, 152, 0, 0.5);
        }
        
        .vapi-notification.warning .notification-icon {
            color: #ff9800;
        }
        
        .vapi-notification.info .notification-icon {
            color: #d4a855;
        }
        
        .notification-icon {
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .notification-message {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
            color: #f5f0eb;
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add parallax effect to hero section
window.addEventListener('scroll', throttle(function() {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;
    
    if (hero && scrolled < window.innerHeight) {
        const heroImage = hero.querySelector('.hero-bg-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
}, 16));

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Console branding
console.log('%c🔥 FLAMES & FLAVOUR', 'font-size: 24px; font-weight: bold; color: #e85a1b;');
console.log('%cPremium Steakhouse Experience', 'font-size: 14px; color: #d4a855;');
console.log('%cBook your table via our AI Voice Agent!', 'font-size: 12px; color: #b8a99a;');
