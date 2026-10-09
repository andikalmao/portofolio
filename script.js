// --------------------------------------------------
// P3R AUDIO & VIDEOS DOM SELECTORS
// --------------------------------------------------
const intro = document.getElementById("intro");
const loop = document.getElementById("loop");
const bgMusic = document.getElementById("audios");
const hoverSound = document.getElementById("hovering");
const clickSound = document.getElementById("clicking");
const exitSound = document.getElementById("exiting");

// Main menu navigation items
const menuItems = document.querySelectorAll('[class^="menu"]');
const screens = document.querySelectorAll(".screen");
const transitionOverlay = document.getElementById("page-transition-overlay");

// Audio volume control setups
if (bgMusic) bgMusic.volume = 0.45;
if (hoverSound) hoverSound.volume = 0.55;
if (clickSound) clickSound.volume = 0.65;
if (exitSound) exitSound.volume = 0.65;


// Safe sound player helper that avoids audio glitches and unhandled rejections
function playSfx(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// Pre-rendered offscreen particle sprites (dramatic performance boost over per-frame shadowBlur)
function createSparkleSprite(coreColor, glowColor) {
    const sprite = document.createElement("canvas");
    const dim = 64;
    sprite.width = dim;
    sprite.height = dim;
    const sCtx = sprite.getContext("2d");
    const center = dim / 2;
    const outerRadius = 15;
    const innerRadius = 5.5;
    const spikes = 4;
    let step = Math.PI / spikes;
    let rot = (Math.PI / 2) * 3;

    // Smooth radial glow
    const grad = sCtx.createRadialGradient(center, center, 2, center, center, 28);
    grad.addColorStop(0, glowColor);
    grad.addColorStop(0.45, glowColor);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(center, center, 28, 0, Math.PI * 2);
    sCtx.fill();

    // Sharp star diamond center
    sCtx.fillStyle = coreColor;
    sCtx.beginPath();
    sCtx.moveTo(center, center - outerRadius);
    for (let i = 0; i < spikes; i++) {
        let x = center + Math.cos(rot) * outerRadius;
        let y = center + Math.sin(rot) * outerRadius;
        sCtx.lineTo(x, y);
        rot += step;

        x = center + Math.cos(rot) * innerRadius;
        y = center + Math.sin(rot) * innerRadius;
        sCtx.lineTo(x, y);
        rot += step;
    }
    sCtx.lineTo(center, center - outerRadius);
    sCtx.closePath();
    sCtx.fill();

    return sprite;
}

const cyanSprite = createSparkleSprite("#ffffff", "rgba(0, 221, 255, 0.7)");
const goldSprite = createSparkleSprite("#ffffff", "rgba(240, 192, 64, 0.7)");

class SparkleParticle {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * -0.8 - 0.2; // float upwards
        this.maxLife = Math.random() * 100 + 50; // duration
        this.life = this.maxLife;
        this.sprite = Math.random() > 0.5 ? cyanSprite : goldSprite;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        // wrap borders
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0) {
            this.y = this.canvas.height;
            this.life = this.maxLife;
        }
    }

    draw() {
        const alpha = Math.sin((this.life / this.maxLife) * Math.PI);
        if (alpha <= 0) return;
        this.ctx.globalAlpha = alpha;
        const drawSize = this.size * 6;
        this.ctx.drawImage(
            this.sprite,
            this.x - drawSize / 2,
            this.y - drawSize / 2,
            drawSize,
            drawSize
        );
        this.ctx.globalAlpha = 1;
    }
}
// --------------------------------------------------
// MUSIC PLAYER CONTROLS (P3R STYLE)
// --------------------------------------------------
const playlist = [
    {
        title: "When the Moon's Reaching Out Stars",
        src: "./assets/audio/WhenTheMoon'sReachingOutStars.mp3"
    },
    {
        title: "Color Your Night",
        src: "./assets/audio/coloryournight.mp3"
    },
    {
        title: "Its Going Down Now",
        src: "./assets/audio/down.mp3"
    },
    {
        title: "Mass Destruction",
        src: "./assets/audio/mass.mp3"
    }

];
let currentTrackIndex = 0;
let isPlaying = false;
let isTransitioning = false;

const musicPlayer = document.getElementById("music-player");
const musicTrackName = document.getElementById("music-track-name");
const playBtn = document.getElementById("music-play");
const prevBtn = document.getElementById("music-prev");
const nextBtn = document.getElementById("music-next");

function loadTrack(index) {
    if (bgMusic && playlist[index]) {
        bgMusic.src = playlist[index].src;
        if (musicTrackName) {
            musicTrackName.textContent = playlist[index].title;
        }
    }
}

function playTrack() {
    if (bgMusic) {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                if (playBtn) playBtn.textContent = "||";
                if (musicPlayer) musicPlayer.classList.add("playing");
            })
            .catch(e => {
                console.log("Play failed: " + e);
            });
    }
}

function pauseTrack() {
    if (bgMusic) {
        bgMusic.pause();
        isPlaying = false;
        if (playBtn) playBtn.textContent = "▶";
        if (musicPlayer) musicPlayer.classList.remove("playing");
    }
}

function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playTrack();
    }
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playTrack();
    }
}

// Initial setup
if (bgMusic) {
    loadTrack(currentTrackIndex);

    playTrack();

    document.addEventListener("click", () => {
        if (!isPlaying && bgMusic.paused) {
            playTrack();
        }
    }, { once: true });


    bgMusic.addEventListener("ended", () => {
        nextTrack();
    });
}

if (playBtn) playBtn.addEventListener("click", togglePlay);
if (nextBtn) nextBtn.addEventListener("click", nextTrack);
if (prevBtn) prevBtn.addEventListener("click", prevTrack);

// Add sound triggers to music player control buttons
const musicCtrlButtons = document.querySelectorAll(".music-ctrl-btn");
musicCtrlButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => console.log(e));
        }
    });
    btn.addEventListener("click", () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }
    });
});

// Idle fadeout/minimize logic for the music player widget
let musicPlayerTimer = null;
const MUSIC_PLAYER_IDLE_TIME = 5000; // 5 seconds of inactivity before minimizing

function resetMusicPlayerTimer() {
    if (!musicPlayer) return;
    
    // Clear any existing timer
    if (musicPlayerTimer) {
        clearTimeout(musicPlayerTimer);
    }
    
    // Remove the idle class to show full controls
    musicPlayer.classList.remove("idle");
    
    // Set timer to minimize player after idle duration
    musicPlayerTimer = setTimeout(() => {
        // Only minimize if user is not currently hovering over the player
        if (!musicPlayer.matches(':hover')) {
            musicPlayer.classList.add("idle");
        }
    }, MUSIC_PLAYER_IDLE_TIME);
}

if (musicPlayer) {
    // Start initial timer on load
    resetMusicPlayerTimer();
    
    // When mouse enters, restore player and keep it active
    musicPlayer.addEventListener("mouseenter", () => {
        if (musicPlayerTimer) clearTimeout(musicPlayerTimer);
        musicPlayer.classList.remove("idle");
    });
    
    // When mouse leaves, restart the idle timer
    musicPlayer.addEventListener("mouseleave", () => {
        resetMusicPlayerTimer();
    });
    
    // Reset timer on any interaction/click inside the player
    musicPlayer.addEventListener("click", () => {
        resetMusicPlayerTimer();
    });
}

// Main menu background videos flow setup
if (intro && loop) {
    intro.src = "./assets/makoto.mp4";
    loop.src = "./assets/makoto_loop.mp4";

    loop.style.display = "none";

    intro.addEventListener("canplay", () => {
        intro.play().catch(e => console.log("Auto-play blocked: user interaction required first."));
    });

    intro.addEventListener("ended", () => {
        intro.style.display = "none";
        loop.style.display = "block";
        loop.play().catch(e => console.log(e));
    });
}

// --------------------------------------------------
// CANVAS SPARKLE PARTICLE SYSTEM
// --------------------------------------------------
const canvas = document.getElementById("sparkle-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animId = null;

    let resizeTimer = null;
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 100);
    });

    function initParticles() {
        particles = [];
        for (let i = 0; i < 40; i++) {
            particles.push(new SparkleParticle(ctx, canvas));
        }
    }
    initParticles();

    function animateParticles() {
        if (!document.hidden) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw();
                if (p.life <= 0) {
                    particles[i] = new SparkleParticle(ctx, canvas);
                }
            }
        }
        animId = requestAnimationFrame(animateParticles);
    }
    animId = requestAnimationFrame(animateParticles);
}

// --------------------------------------------------
// SOUND TRIGGERS & NAV BUTTONS HOVER/CLICK ACTIONS
// --------------------------------------------------
menuItems.forEach(menu => {
    menu.addEventListener("mouseenter", () => playSfx(hoverSound));

    menu.addEventListener("click", () => {
        const targetScreenId = menu.getAttribute("data-screen");
        if (targetScreenId) {
            if (isTransitioning) return;
            playSfx(clickSound);
            switchToScreen(targetScreenId);
        }

        const targetLink = menu.getAttribute("data-link");
        if (targetLink) {
            playSfx(clickSound);
            window.open(targetLink, '_blank');
        }
    });
});

// Setup back buttons across all subpages
const backButtons = document.querySelectorAll(".p3-back-btn");
backButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => playSfx(hoverSound));
    btn.addEventListener("click", () => {
        if (isTransitioning) return;
        playSfx(exitSound);
        switchToScreen("main-menu-screen");
    });
});

// Switch screens with wipe animation transitions
function switchToScreen(id) {
    if (isTransitioning) return;

    const target = document.getElementById(id);
    if (target && target.classList.contains("active")) {
        return;
    }

    if (transitionOverlay) {
        isTransitioning = true;
        transitionOverlay.classList.remove("trigger-wipe");
        
        // Use requestAnimationFrame instead of forced layout reflow (void transitionOverlay.offsetWidth)
        requestAnimationFrame(() => {
            transitionOverlay.classList.add("trigger-wipe");
        });

        setTimeout(() => {
            // Hide all screen nodes
            screens.forEach(s => {
                s.classList.remove("active");
                s.classList.add("hidden");
            });

            // Pause background video decoding when away from main menu to save GPU & CPU
            if (id === "main-menu-screen") {
                if (loop) {
                    loop.style.display = "block";
                    loop.play().catch(e => console.log(e));
                }
            } else {
                if (loop) {
                    loop.pause();
                    loop.style.display = "none";
                }
                if (intro) {
                    intro.pause();
                    intro.style.display = "none";
                }
            }

            // Show selected screen node
            if (target) {
                target.classList.remove("hidden");
                target.classList.add("active");
            }
        }, 500); // exactly at mid point of wipe transition

        setTimeout(() => {
            isTransitioning = false;
        }, 1200); // matches the 1.2s CSS transition length
    }
}

// Cards Pop-out interaction flow
const cardWrappers = document.querySelectorAll(".card-wrapper");
const popoutOverlay = document.getElementById("card-popout-overlay");
const popoutImg = document.getElementById("popout-main-img");
const popoutCategory = document.getElementById("popout-category-pill");
const popoutSkillsList = document.getElementById("popout-skills-list");
const cancelBtn = document.getElementById("popout-cancel-btn");
const drawVal = document.getElementById("draw-val");
const mainCardHolder = document.querySelector(".main-popout-card-holder");
const numLeft = mainCardHolder ? mainCardHolder.querySelector(".top-left") : null;
const numRight = mainCardHolder ? mainCardHolder.querySelector(".bottom-right") : null;
const badgeColors = ["#ff4466", "#f0c040", "#00ddff", "#44dd66"];

cardWrappers.forEach(card => {
    // Pre-cache attributes to avoid parsing JSON and querying DOM on every click
    const imgEl = card.querySelector(".card");
    const imgPath = imgEl ? imgEl.getAttribute("src") : "";
    const badge = card.getAttribute("data-badge") || "";
    const index = parseInt(card.getAttribute("data-index") || "0", 10);
    const cornerNumEl = card.querySelector(".corner-num");
    const cornerNum = cornerNumEl ? cornerNumEl.textContent : "";
    let skills = [];
    try {
        skills = JSON.parse(card.getAttribute("data-skills") || "[]");
    } catch {
        skills = [];
    }

    card.addEventListener("click", () => {
        playSfx(clickSound);

        // Setup draw value & card numbers
        if (drawVal) drawVal.textContent = index + 1;
        if (numLeft) numLeft.textContent = cornerNum;
        if (numRight) numRight.textContent = cornerNum;

        // Fill out overlay values
        if (popoutImg) popoutImg.setAttribute("src", imgPath);
        if (popoutCategory) {
            popoutCategory.textContent = badge;
            if (badgeColors[index]) popoutCategory.style.backgroundColor = badgeColors[index];
        }

        if (popoutSkillsList) {
            popoutSkillsList.innerHTML = "";
            const fragment = document.createDocumentFragment();
            skills.forEach(skill => {
                const li = document.createElement("li");
                li.textContent = skill;
                fragment.appendChild(li);
            });
            popoutSkillsList.appendChild(fragment);
        }

        // Show overlay with transition
        if (popoutOverlay) popoutOverlay.classList.add("active-popout");
    });
});

if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        playSfx(clickSound);
        if (popoutOverlay) popoutOverlay.classList.remove("active-popout");
    });
}

// Close popup on backdrop click as well
if (popoutOverlay) {
    popoutOverlay.addEventListener("click", (e) => {
        if (e.target === popoutOverlay) {
            playSfx(clickSound);
            popoutOverlay.classList.remove("active-popout");
        }
    });
}

// --------------------------------------------------
// PAGE 3: PROJECTS DETAILED INTERACTION FLOW
// --------------------------------------------------
const projectCards = document.querySelectorAll(".project-card");
const projectOverlay = document.getElementById("project-popout-overlay");
const projectCloseBtn = document.getElementById("proj-close-btn");

const projDetailNum = document.getElementById("proj-detail-num");
const projDetailTitle = document.getElementById("proj-detail-title");
const projDetailTech = document.getElementById("proj-detail-tech");
const projDetailDesc = document.getElementById("proj-detail-desc");
const projVisitLink = document.getElementById("proj-visit-link");
const projVisitBtn = document.getElementById("proj-visit-btn");

projectCards.forEach(pCard => {
    pCard.addEventListener("click", () => {
        playSfx(clickSound);

        const title = pCard.getAttribute("data-title");
        const tech = pCard.getAttribute("data-tech");
        const desc = pCard.getAttribute("data-desc");
        const num = pCard.querySelector(".project-card-num")?.textContent || "";
        const link = pCard.getAttribute("data-link");
        const linkText = pCard.getAttribute("data-link-text");

        if (projDetailNum) projDetailNum.textContent = num;
        if (projDetailTitle) projDetailTitle.textContent = title;
        if (projDetailTech) projDetailTech.textContent = tech;
        if (projDetailDesc) projDetailDesc.textContent = desc;
        if (projVisitLink) projVisitLink.setAttribute("href", link || "#");
        if (projVisitBtn) projVisitBtn.textContent = linkText || "VISIT SITE ↗";

        if (projectOverlay) projectOverlay.classList.add("active-popout");
    });
});

if (projectCloseBtn) {
    projectCloseBtn.addEventListener("click", () => {
        playSfx(clickSound);
        if (projectOverlay) projectOverlay.classList.remove("active-popout");
    });
}

if (projectOverlay) {
    projectOverlay.addEventListener("click", (e) => {
        if (e.target === projectOverlay) {
            playSfx(clickSound);
            projectOverlay.classList.remove("active-popout");
        }
    });
}

// --------------------------------------------------
// COMMU MENU INTERACTION LOGIC
// --------------------------------------------------
const commuItems = document.querySelectorAll(".commu-item");
const detailName = document.getElementById("commu-detail-name");
const detailUsername = document.getElementById("commu-detail-username");
const detailDesc = document.getElementById("commu-detail-desc");
const actionBtn = document.getElementById("commu-action-btn");
const cardImg = document.getElementById("commu-card-img");

let activeCommuIndex = 0;

// Pre-cache item metadata to eliminate DOM queries and allocations on hover
const commuData = Array.from(commuItems).map(item => ({
    name: item.querySelector(".commu-platform-name")?.textContent || "",
    username: item.getAttribute("data-username") || "",
    desc: item.getAttribute("data-desc") || "",
    link: item.getAttribute("data-link") || "",
    bg: item.getAttribute("data-bg") || ""
}));

function updateCommuSelection(index) {
    if (index < 0 || index >= commuItems.length) return;
    
    // De-activate previous active item only
    if (commuItems[activeCommuIndex]) {
        commuItems[activeCommuIndex].classList.remove("active-item");
    }

    activeCommuIndex = index;
    const item = commuItems[index];
    const data = commuData[index];
    if (!item || !data) return;

    item.classList.add("active-item");

    if (detailName) detailName.textContent = data.name;
    if (detailUsername) detailUsername.textContent = data.username;
    if (detailDesc) detailDesc.textContent = data.desc;
    if (actionBtn) actionBtn.setAttribute("href", data.link);
    if (cardImg) cardImg.setAttribute("src", data.bg);
}

commuItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
        if (activeCommuIndex !== index) {
            updateCommuSelection(index);
            playSfx(hoverSound);
        }
    });

    item.addEventListener("click", () => {
        playSfx(clickSound);
        const link = commuData[index]?.link || item.getAttribute("data-link");
        if (link) window.open(link, "_blank");
    });
});

// --------------------------------------------------
// GLOBAL KEYBOARD SHORTCUTS
// --------------------------------------------------
const contactMenu = document.getElementById("contact-menu");

document.addEventListener("keydown", (e) => {
    if (document.activeElement && (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable
    )) {
        return;
    }

    const isContactActive = contactMenu && contactMenu.classList.contains("active");

    if (isContactActive) {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            let prevIndex = (activeCommuIndex - 1 + commuItems.length) % commuItems.length;
            updateCommuSelection(prevIndex);
            playSfx(hoverSound);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            let nextIndex = (activeCommuIndex + 1) % commuItems.length;
            updateCommuSelection(nextIndex);
            playSfx(hoverSound);
        } else if (e.key === "Enter") {
            e.preventDefault();
            playSfx(clickSound);
            const link = commuData[activeCommuIndex]?.link;
            if (link) window.open(link, "_blank");
        }
    }

    if (e.key === "b" || e.key === "B") {
        if (isTransitioning) return;
        let actionTriggered = false;

        if (popoutOverlay && popoutOverlay.classList.contains("active-popout")) {
            playSfx(clickSound);
            popoutOverlay.classList.remove("active-popout");
            actionTriggered = true;
        }

        if (projectOverlay && projectOverlay.classList.contains("active-popout")) {
            playSfx(clickSound);
            projectOverlay.classList.remove("active-popout");
            actionTriggered = true;
        }

        if (!actionTriggered) {
            const activeScreen = document.querySelector(".screen.active");
            if (activeScreen && activeScreen.id !== "main-menu-screen") {
                playSfx(exitSound);
                switchToScreen("main-menu-screen");
            }
        }
    }
});