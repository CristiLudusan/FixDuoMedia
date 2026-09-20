document.addEventListener('DOMContentLoaded', () => {

    /* 1. VERIFICARE DINAMICĂ MOBIL */
    const isMobileMode = () => {
        return window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;
    };

    /* 2. CURSOR CUSTOM (ACCELERARE HARDWARE GPU VIA TRANSLATE3D) */
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorRing = document.getElementById('custom-cursor-ring');
    const cursorText = document.getElementById('cursor-text');

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isMoving = false;
    let rafId = null;

    if (!isMobileMode() && cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

            if (!isMoving) {
                isMoving = true;
                rafId = requestAnimationFrame(renderCursorRing);
            }
        }, { passive: true });

        function renderCursorRing() {
            const dx = mouseX - ringX;
            const dy = mouseY - ringY;
            
            ringX += dx * 0.2;
            ringY += dy * 0.2;

            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
                isMoving = false;
                cancelAnimationFrame(rafId);
            } else {
                rafId = requestAnimationFrame(renderCursorRing);
            }
        }

        const hoverTargets = document.querySelectorAll('.cursor-hover, a, button, input, label, select, textarea, .portfolio-item');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hovered');
                const customText = target.getAttribute('data-cursor') || 'VIEW';
                if (cursorText) cursorText.innerText = customText;
            }, { passive: true });

            target.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hovered');
                if (cursorText) cursorText.innerText = '';
            }, { passive: true });
        });
    }

    /* 3. SCROLL PROGRESS & NAVBAR SCROLLED EFFECT */
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const totalHeight = document.body.scrollHeight - window.innerHeight;
                const progress = totalHeight > 0 ? (window.scrollY / totalHeight) : 0;
                
                if (scrollProgress) {
                    scrollProgress.style.transform = `scaleX(${progress})`;
                }

                if (navbar) {
                    if (window.scrollY > 30) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    /* 4. MENU MOBILE TOGGLE */
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

    /* 5. LIGHTBOX GALERIE & PROMPT MOBIL (APASĂ DIN NOU PENTRU MĂRIRE) */
    const galleryItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const mobileHint = document.getElementById('mobile-img-hint');

    let activeTappedItem = null;
    let hintTimeout = null;

    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgEl = item.querySelector('img');
            const titleEl = item.querySelector('h4');

            // Logica specifică pentru modul de Telefon / Touch
            if (isMobileMode()) {
                if (activeTappedItem !== item) {
                    galleryItems.forEach(i => i.classList.remove('img-tapped'));
                    item.classList.add('img-tapped');
                    activeTappedItem = item;

                    if (mobileHint) {
                        mobileHint.innerText = "Apasă din nou pentru a mări imaginea";
                        mobileHint.classList.add('show');
                        clearTimeout(hintTimeout);
                        hintTimeout = setTimeout(() => {
                            mobileHint.classList.remove('show');
                        }, 3000);
                    }
                    return; // Opriți executarea la prima apăsare pe mobil
                }
            }

            // A doua apăsare pe mobil SAU apăsarea pe Desktop deschide imaginea
            if (lightboxImg && imgEl) lightboxImg.src = imgEl.src;
            if (lightboxCaption && titleEl) lightboxCaption.innerText = titleEl.innerText;
            if (lightbox) lightbox.classList.add('active');

            if (mobileHint) mobileHint.classList.remove('show');
            galleryItems.forEach(i => i.classList.remove('img-tapped'));
            activeTappedItem = null;
        });
    });

    // Resetare dacă utilizatorul apasă în afara galerei
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.portfolio-item') && activeTappedItem) {
            galleryItems.forEach(i => i.classList.remove('img-tapped'));
            activeTappedItem = null;
            if (mobileHint) mobileHint.classList.remove('show');
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox) lightbox.classList.remove('active');
    });

    /* 6. CALCULATOR PREȚ & AUTOCOMPLETARE FORMULAR */
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
        'calc-premium': 'Pachet Premium (2200 LEI)'
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
            if (val.startsWith('Serviciul Foto')) document.getElementById('calc-photo').checked = true;
            else if (val.startsWith('Serviciul Video')) document.getElementById('calc-video').checked = true;
            else if (val.startsWith('Pachet Foto/Video')) document.getElementById('calc-package').checked = true;
            else if (val.startsWith('Pachet Premium')) document.getElementById('calc-premium').checked = true;
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

    /* 7. CUSTOM VIDEO PLAYER LOGIC */
    const videoCard = document.querySelector('.custom-video-card');
    const customVideo = document.getElementById('custom-video');
    const bigPlayBtn = document.getElementById('big-play-btn');
    const videoPlayBtn = document.getElementById('video-play-btn');
    const videoMuteBtn = document.getElementById('video-mute-btn');
    const videoFullscreenBtn = document.getElementById('video-fullscreen-btn');
    const videoProgressContainer = document.getElementById('video-progress-container');
    const videoProgressBar = document.getElementById('video-progress-bar');
    const videoTime = document.getElementById('video-time');

    if (customVideo && videoCard) {
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        const togglePlay = () => {
            if (customVideo.paused) {
                customVideo.play();
                videoCard.classList.add('playing');
                videoCard.classList.remove('paused');
                if (bigPlayBtn) bigPlayBtn.innerHTML = '<i class="fa-solid fa-pause ml-0"></i>';
                if (videoPlayBtn) videoPlayBtn.innerHTML = '<i class="fa-solid fa-pause text-sm"></i>';
            } else {
                customVideo.pause();
                videoCard.classList.remove('playing');
                videoCard.classList.add('paused');
                if (bigPlayBtn) bigPlayBtn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
                if (videoPlayBtn) videoPlayBtn.innerHTML = '<i class="fa-solid fa-play text-sm"></i>';
            }
        };

        const toggleFullscreen = () => {
            // Detectăm dacă utilizatorul este pe mobil sau tabletă
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);

            if (isMobile) {
                // PE MOBIL: Deschidem direct player-ul nativ al telefonului
                if (customVideo.webkitEnterFullscreen) {
                    customVideo.webkitEnterFullscreen(); // Pentru iOS / Safari
                } else if (customVideo.requestFullscreen) {
                    customVideo.requestFullscreen(); // Pentru Android / Chrome
                }
            } else {
                // PE DESKTOP: Folosim player-ul custom în Fullscreen
                if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                    if (videoCard.requestFullscreen) {
                        videoCard.requestFullscreen();
                    } else if (videoCard.webkitRequestFullscreen) {
                        videoCard.webkitRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            }
        };

        if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);
        if (videoPlayBtn) videoPlayBtn.addEventListener('click', togglePlay);

        customVideo.addEventListener('timeupdate', () => {
            if (customVideo.duration) {
                const progress = (customVideo.currentTime / customVideo.duration) * 100;
                if (videoProgressBar) videoProgressBar.style.width = `${progress}%`;
                if (videoTime) {
                    videoTime.innerText = `${formatTime(customVideo.currentTime)} / ${formatTime(customVideo.duration)}`;
                }
            }
        });

        customVideo.addEventListener('loadedmetadata', () => {
            if (videoTime && customVideo.duration) {
                videoTime.innerText = `00:00 / ${formatTime(customVideo.duration)}`;
            }
        });

        if (videoProgressContainer) {
            videoProgressContainer.addEventListener('click', (e) => {
                const rect = videoProgressContainer.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                customVideo.currentTime = clickPos * customVideo.duration;
            });
        }

        if (videoMuteBtn) {
            videoMuteBtn.addEventListener('click', () => {
                customVideo.muted = !customVideo.muted;
                videoMuteBtn.innerHTML = customVideo.muted 
                    ? '<i class="fa-solid fa-volume-xmark text-xs"></i>' 
                    : '<i class="fa-solid fa-volume-high text-xs"></i>';
            });
        }

        if (videoFullscreenBtn) {
            videoFullscreenBtn.addEventListener('click', toggleFullscreen);
        }

        /* GESTIONARE CURSOR NATIV ȘI ICONIȚĂ ÎN FULLSCREEN */
        const handleFullscreenChange = () => {
            const cursorDot = document.getElementById('custom-cursor-dot');
            const cursorRing = document.getElementById('custom-cursor-ring');
            const isFS = document.fullscreenElement || document.webkitFullscreenElement;

            if (isFS) {
                if (cursorDot) isFS.appendChild(cursorDot);
                if (cursorRing) isFS.appendChild(cursorRing);
                if (videoFullscreenBtn) {
                    videoFullscreenBtn.innerHTML = '<i class="fa-solid fa-compress text-xs"></i>';
                }
            } else {
                if (cursorDot) document.body.appendChild(cursorDot);
                if (cursorRing) document.body.appendChild(cursorRing);
                if (videoFullscreenBtn) {
                    videoFullscreenBtn.innerHTML = '<i class="fa-solid fa-expand text-xs"></i>';
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        /* COMENZI RAPIDE DE LA TASTATURĂ (SHORTCUTS) */
        document.addEventListener('keydown', (e) => {
            // Ignorăm comanda dacă utilizatorul scrie într-un câmp de text/formular
            const activeEl = document.activeElement;
            const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
            if (isInput) return;

            const isFS = document.fullscreenElement || document.webkitFullscreenElement;
            const isHovered = videoCard.matches(':hover');

            // Comenzile funcționează dacă suntem în Fullscreen sau dacă mouse-ul este peste player
            if (isFS || isHovered) {
                // SPACE: Play / Pause
                if (e.key === ' ' || e.code === 'Space') {
                    e.preventDefault();
                    togglePlay();
                }
                // SĂGEATĂ STÂNGA: Inapoi 5 secunde
                else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (customVideo.duration) {
                        customVideo.currentTime = Math.max(0, customVideo.currentTime - 5);
                    }
                }
                // SĂGEATĂ DREAPTA: Înainte 5 secunde
                else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (customVideo.duration) {
                        customVideo.currentTime = Math.min(customVideo.duration, customVideo.currentTime + 5);
                    }
                }
                // TASTA F: Toggle Fullscreen
                else if (e.key === 'f' || e.key === 'F') {
                    e.preventDefault();
                    toggleFullscreen();
                }
            }
        });

        customVideo.addEventListener('ended', () => {
            videoCard.classList.remove('playing');
            videoCard.classList.add('paused');
            if (bigPlayBtn) bigPlayBtn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
            if (videoPlayBtn) videoPlayBtn.innerHTML = '<i class="fa-solid fa-play text-sm"></i>';
            if (videoProgressBar) videoProgressBar.style.width = '0%';
        });
    }
});