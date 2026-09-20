document.addEventListener('DOMContentLoaded', () => {

    /* 1. CURSOR CUSTOM */
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorRing = document.getElementById('custom-cursor-ring');
    const cursorText = document.getElementById('cursor-text');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    const renderCursor = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const hoverTargets = document.querySelectorAll('.cursor-hover, a, button, input, label, select, textarea, .portfolio-item');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            if (cursorRing) cursorRing.classList.add('hovered');
            const customText = target.getAttribute('data-cursor') || 'VIEW';
            if (cursorText) cursorText.innerText = customText;
        });
        target.addEventListener('mouseleave', () => {
            if (cursorRing) cursorRing.classList.remove('hovered');
            if (cursorText) cursorText.innerText = '';
        });
    });

    /* 2. SCROLL PROGRESS & NAVBAR SCROLLED EFFECT */
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / (totalHeight || 1)) * 100;
        if (scrollProgress) scrollProgress.style.width = `${progress}%`;

        // Micșorare lină a navbar-ului la scroll
        if (navbar) {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    /* 3. MENU MOBILE TOGGLE (Cu animație fluidă Slide & Fade) */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuToggle.classList.toggle('active', isOpen);

            if (menuIcon) {
                if (isOpen) {
                    menuIcon.classList.remove('fa-bars-staggered');
                    menuIcon.classList.add('fa-xmark');
                } else {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars-staggered');
                }
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars-staggered');
                }
            });
        });
    }

    /* 4. LIGHTBOX GALERIE & HINT PENTRU MOBIL */
    const galleryItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const mobileHint = document.getElementById('mobile-img-hint');

    let isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    let activeTappedItem = null;
    let hintTimeout = null;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgEl = item.querySelector('img');
            const titleEl = item.querySelector('h4');

            if (isTouchDevice) {
                if (activeTappedItem !== item) {
                    galleryItems.forEach(i => i.classList.remove('img-tapped'));
                    item.classList.add('img-tapped');
                    activeTappedItem = item;

                    if (mobileHint) {
                        mobileHint.classList.add('show');
                        clearTimeout(hintTimeout);
                        hintTimeout = setTimeout(() => {
                            mobileHint.classList.remove('show');
                        }, 2500);
                    }
                    return;
                }
            }

            if (lightboxImg && imgEl) lightboxImg.src = imgEl.src;
            if (lightboxCaption && titleEl) lightboxCaption.innerText = titleEl.innerText;
            if (lightbox) lightbox.classList.add('active');

            if (mobileHint) mobileHint.classList.remove('show');
            item.classList.remove('img-tapped');
            activeTappedItem = null;
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox) lightbox.classList.remove('active');
    });

    /* 5. CALCULATOR PREȚ & AUTOCOMPLETARE FORMULAR */
    const calcItems = document.querySelectorAll('.calc-item');
    const totalPriceEl = document.getElementById('total-price');

    const formMainService = document.getElementById('form-main-service');
    const formExtraReel = document.getElementById('form-extra-reel');
    const formExtraFramed = document.getElementById('form-extra-framed');
    const formExtraPreshoot = document.getElementById('form-extra-preshoot');
    const formTotal = document.getElementById('form-total');

    const mainServicesMap = {
        'calc-photo': 'Serviciul Foto (800 LEI)',
        'calc-video': 'Serviciul Video (1000 LEI)',
        'calc-package': 'Pachet Foto/Video (1600 LEI)',
        'calc-premium': 'Pachet Premium (1 Fotograf + 2 Videografi) (2200 LEI)'
    };

    const calculateTotal = () => {
        let total = 0;
        let selectedMain = 'Niciunul';

        calcItems.forEach(item => {
            if (item.checked) {
                total += parseInt(item.dataset.price || 0, 10);
            }
        });

        const selectedMainInput = Array.from(document.querySelectorAll('#calc-photo, #calc-video, #calc-package, #calc-premium')).find(i => i.checked);
        if (selectedMainInput) {
            selectedMain = mainServicesMap[selectedMainInput.id] || 'Niciunul';
        }

        if (totalPriceEl) totalPriceEl.innerText = `${total.toLocaleString('ro-RO')} LEI`;

        if (formMainService) formMainService.value = selectedMain;
        if (formExtraReel && document.getElementById('calc-reel')) formExtraReel.checked = document.getElementById('calc-reel').checked;
        if (formExtraFramed && document.getElementById('calc-framed')) formExtraFramed.checked = document.getElementById('calc-framed').checked;
        if (formExtraPreshoot && document.getElementById('calc-preshoot')) formExtraPreshoot.checked = document.getElementById('calc-preshoot').checked;
        if (formTotal) formTotal.value = `${total.toLocaleString('ro-RO')} LEI`;
    };

    const syncFormToCalc = () => {
        let total = 0;

        document.querySelectorAll('#calc-photo, #calc-video, #calc-package, #calc-premium').forEach(i => i.checked = false);

        if (formMainService) {
            const val = formMainService.value;
            if (val.startsWith('1. Serviciul Foto')) document.getElementById('calc-photo').checked = true;
            else if (val.startsWith('2. Serviciul Video')) document.getElementById('calc-video').checked = true;
            else if (val.startsWith('3. Pachet Foto/Video')) document.getElementById('calc-package').checked = true;
            else if (val.startsWith('4. Pachet Premium')) document.getElementById('calc-premium').checked = true;
        }

        if (formExtraReel && document.getElementById('calc-reel')) document.getElementById('calc-reel').checked = formExtraReel.checked;
        if (formExtraFramed && document.getElementById('calc-framed')) document.getElementById('calc-framed').checked = formExtraFramed.checked;
        if (formExtraPreshoot && document.getElementById('calc-preshoot')) document.getElementById('calc-preshoot').checked = formExtraPreshoot.checked;

        calcItems.forEach(item => {
            if (item.checked) total += parseInt(item.dataset.price || 0, 10);
        });

        if (totalPriceEl) totalPriceEl.innerText = `${total.toLocaleString('ro-RO')} LEI`;
        if (formTotal) formTotal.value = `${total.toLocaleString('ro-RO')} LEI`;
    };

    calcItems.forEach(input => {
        input.addEventListener('change', (e) => {
            if (['calc-photo', 'calc-video', 'calc-package', 'calc-premium'].includes(e.target.id) && e.target.checked) {
                ['calc-photo', 'calc-video', 'calc-package', 'calc-premium'].forEach(id => {
                    if (id !== e.target.id) {
                        const el = document.getElementById(id);
                        if (el) el.checked = false;
                    }
                });
            }
            calculateTotal();
        });
    });

    if (formMainService) formMainService.addEventListener('change', syncFormToCalc);
    [formExtraReel, formExtraFramed, formExtraPreshoot].forEach(chk => {
        if (chk) chk.addEventListener('change', syncFormToCalc);
    });

    calculateTotal();
});