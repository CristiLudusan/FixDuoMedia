document.addEventListener('DOMContentLoaded', () => {

    /* CURSOR CUSTOM */
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

    const hoverTargets = document.querySelectorAll('.cursor-hover, a, button, input, label, .portfolio-item');
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

    /* SCROLL PROGRESS */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    });

    /* MENU MOBILE */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    /* LIGHTBOX GALERIE */
    const galleryItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgEl = item.querySelector('img');
            const titleEl = item.querySelector('h4');
            if (lightboxImg) lightboxImg.src = imgEl.src;
            if (lightboxCaption) lightboxCaption.innerText = titleEl ? titleEl.innerText : '';
            if (lightbox) lightbox.classList.add('active');
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox) lightbox.classList.remove('active');
    });

    /* CALCULATOR PREȚ */
    /* CALCULATOR PREȚ & AUTOCOMPLETARE FORMULAR */
    const calcItems = document.querySelectorAll('.calc-item');
    const totalPriceEl = document.getElementById('total-price');
    
    // Elemente formular
    const formMainService = document.getElementById('form-main-service');
    const formExtraReel = document.getElementById('form-extra-reel');
    const formExtraFramed = document.getElementById('form-extra-framed');
    const formExtraPreshoot = document.getElementById('form-extra-preshoot');
    const formTotal = document.getElementById('form-total');

    // Harta de legătură între calculator și formular
    const mainServicesMap = {
        'calc-photo': 'Serviciul Foto (800 LEI)',
        'calc-video': 'Serviciul Video (1000 LEI)',
        'calc-package': 'Pachet Foto/Video (1600 LEI)',
        'calc-premium': 'Pachet Premium (2200 LEI)'
    };

    const calculateTotal = () => {
        let total = 0;
        let selectedMain = 'Niciunul';

        // Calcul total calculator
        calcItems.forEach(item => {
            if (item.checked) {
                total += parseInt(item.dataset.price);
            }
        });

        // Verificare Serviciu Principal selectat în calculator
        const selectedMainInput = Array.from(document.querySelectorAll('#calc-photo, #calc-video, #calc-package, #calc-premium')).find(i => i.checked);
        if (selectedMainInput) {
            selectedMain = mainServicesMap[selectedMainInput.id];
        }

        // Actualizare afișaj pret calculator
        if (totalPriceEl) totalPriceEl.innerText = `${total.toLocaleString()} LEI`;

        // Autocompletare în Formular
        if (formMainService) formMainService.value = selectedMain;
        if (formExtraReel) formExtraReel.checked = document.getElementById('calc-reel').checked;
        if (formExtraFramed) formExtraFramed.checked = document.getElementById('calc-framed').checked;
        if (formExtraPreshoot) formExtraPreshoot.checked = document.getElementById('calc-preshoot').checked;
        if (formTotal) formTotal.value = `${total.toLocaleString()} LEI`;
    };

    // Sincronizare inversă: când utilizatorul schimbă ceva manual în FORMULAR
    const syncFormToCalc = () => {
        let total = 0;

        // Resetare servicii principale din calculator
        document.querySelectorAll('#calc-photo, #calc-video, #calc-package, #calc-premium').forEach(i => i.checked = false);

        // Activare bifă potrivită din calculator pe baza select-ului din formular
        if (formMainService.value.includes('Serviciul Foto')) document.getElementById('calc-photo').checked = true;
        if (formMainService.value.includes('Serviciul Video')) document.getElementById('calc-video').checked = true;
        if (formMainService.value.includes('Pachet Foto/Video')) document.getElementById('calc-package').checked = true;
        if (formMainService.value.includes('Pachet Premium')) document.getElementById('calc-premium').checked = true;

        // Sincronizare opțiuni extra din formular în calculator
        document.getElementById('calc-reel').checked = formExtraReel.checked;
        document.getElementById('calc-framed').checked = formExtraFramed.checked;
        document.getElementById('calc-preshoot').checked = formExtraPreshoot.checked;

        // Recalculare total
        calcItems.forEach(item => {
            if (item.checked) total += parseInt(item.dataset.price);
        });

        if (totalPriceEl) totalPriceEl.innerText = `${total.toLocaleString()} LEI`;
        if (formTotal) formTotal.value = `${total.toLocaleString()} LEI`;
    };

    // Evenimente pe calculator
    calcItems.forEach(input => {
        input.addEventListener('change', (e) => {
            // Dacă se selectează un Serviciu Principal, le desselectăm pe celelalte servicii principale
            if (['calc-photo', 'calc-video', 'calc-package', 'calc-premium'].includes(e.target.id) && e.target.checked) {
                ['calc-photo', 'calc-video', 'calc-package', 'calc-premium'].forEach(id => {
                    if (id !== e.target.id) document.getElementById(id).checked = false;
                });
            }
            calculateTotal();
        });
    });

    // Evenimente pe formular
    if (formMainService) formMainService.addEventListener('change', syncFormToCalc);
    [formExtraReel, formExtraFramed, formExtraPreshoot].forEach(chk => {
        if (chk) chk.addEventListener('change', syncFormToCalc);
    });

    calculateTotal();
});