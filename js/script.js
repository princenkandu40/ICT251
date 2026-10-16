/* ==========================================================================
   Activity 3 JavaScript - Interactive Portfolio
   Author: Prince Nkandu
   Course: ICT251 Web Technologies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
    initThemeSwitcher();
    initPhotoGallery();
    initMobileNav();
});

/* --------------------------------------------------------------------------
   Feature 1 (Compulsory): Contact Form Validation & Formspree AJAX Submission
   Validates fields against empty/whitespace inputs and valid email formats,
   then submits asynchronously to Formspree upon successful validation.
   -------------------------------------------------------------------------- */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const topicInput = document.getElementById('topic');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const previewBox = document.getElementById('form-preview');
    const previewName = document.getElementById('preview-name');
    const previewEmail = document.getElementById('preview-email');
    const previewTopic = document.getElementById('preview-topic');
    const previewMessage = document.getElementById('preview-message');

    // Standard email regex structure
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent page reload

        let isValid = true;

        // Reset error messages
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (messageError) messageError.textContent = '';

        // Validate Full Name
        if (nameInput.value.trim() === '') {
            if (nameError) nameError.textContent = 'Please enter your full name (cannot be blank).';
            isValid = false;
        }

        // Validate Email Address
        if (!emailRegex.test(emailInput.value.trim())) {
            if (emailError) emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        // Validate Message
        if (messageInput.value.trim() === '') {
            if (messageError) messageError.textContent = 'Please write a message before submitting.';
            isValid = false;
        }

        if (isValid) {
            // Optional: Update preview elements if you still want the preview box visible
            if (previewBox && previewName && previewEmail && previewTopic && previewMessage) {
                previewName.textContent = nameInput.value.trim();
                previewEmail.textContent = emailInput.value.trim();
                previewTopic.textContent = topicInput.value;
                previewMessage.textContent = messageInput.value.trim();
                previewBox.classList.remove('hidden');
            }

            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Replace form contents with a success message once successfully delivered
                    form.innerHTML = `
                        <div class="form-success-message">
                            Thank you! Your message has been sent successfully.
                        </div>
                    `;
                } else {
                    const data = await response.json();
                    alert(data.error || 'Oops! There was a problem submitting your form.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }
                }
            } catch (error) {
                alert('Network error. Please check your connection and try again.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        } else {
            if (previewBox) previewBox.classList.add('hidden');
        }
    });
}

/* --------------------------------------------------------------------------
   Feature 2: Light / Dark Theme Switcher
   Toggles between light and dark visual themes on the body element.
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-toggle-btn');

    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeBtn.textContent = 'Toggle Dark Theme';
        } else {
            themeBtn.textContent = 'Toggle Light Theme';
        }
    });
}

/* --------------------------------------------------------------------------
   Feature: Photo Gallery Viewer & Fullscreen Lightbox
   Cycling photos + full-view zoom modal handling.
   -------------------------------------------------------------------------- */
function initPhotoGallery() {
    const photos = [
        { src: 'Images/Photo1.jpg', caption: 'MY PORTRAIT', alt: 'Portrait of Prince Nkandu' },
        { src: 'Images/file_000000001e448211a7f237d715beaa01.png', caption: 'git commit -m"In my jordan and paused for a pic"', alt: 'git commit -m "In my jordan and paused for a pic' },
        { src: 'Images/IMG_20250827_125818_691.jpg', caption: 'Checkmate to ICT', alt: 'Checkmate to ICT' },
        { src: 'Images/PXL_20260428_132029538.PORTRAIT.jpg', caption: 'Personal Photo', alt: 'Personal Photo' }
    ];

    let currentIndex = 0;

    const imgElement = document.getElementById('gallery-img');
    const captionElement = document.getElementById('gallery-caption');
    const counterElement = document.getElementById('gallery-counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // Modal elements
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.getElementById('close-modal');

    if (!imgElement || !prevBtn || !nextBtn) return;

    function updateGallery(index) {
        imgElement.src = photos[index].src;
        imgElement.alt = photos[index].alt;
        if (captionElement) captionElement.textContent = photos[index].caption;
        if (counterElement) counterElement.textContent = `${index + 1} / ${photos.length}`;
    }

    function openModal() {
        if (!modal || !modalImg) return;
        modal.classList.remove('hidden');
        modalImg.src = photos[currentIndex].src;
        modalImg.alt = photos[currentIndex].alt;
        if (modalCaption) modalCaption.textContent = photos[currentIndex].caption;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? photos.length - 1 : currentIndex - 1;
        updateGallery(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === photos.length - 1) ? 0 : currentIndex + 1;
        updateGallery(currentIndex);
    });

    // Open Full View when clicking the button or the image itself
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', openModal);
    imgElement.addEventListener('click', openModal);

    // Close Modal events
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
}

/* --------------------------------------------------------------------------
   Feature 4: Mobile Navigation Toggle
   Expands or collapses navigation links on narrow viewports.
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        // 1. Toggle menu when clicking the menu button
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isActive);
        });

        // 2. Close menu when clicking any link inside it
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // 3. Close menu when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && e.target !== menuBtn) {
                navLinks.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}