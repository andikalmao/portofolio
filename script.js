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


// CLASS


class SparkleParticle {
    constructor(ctx, canvas) {
        this.ctx = ctx
        this.canvas = canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * -0.8 - 0.2; // float upwards
        this.maxLife = Math.random() * 100 + 50; // duration
        this.life = this.maxLife;
        this.color = Math.random() > 0.5 ? "rgba(0, 221, 255," : "rgba(240, 192, 64,"; // cyan vs gold
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
        const alpha = Math.sin((this.life / this.maxLife) * Math.PI); // fade in/out
        this.ctx.shadowBlur = this.size * 2;
        this.ctx.shadowColor = this.color.includes("240") ? "#f0c040" : "#00ddff";
        this.ctx.fillStyle = `${this.color}${alpha})`;
        this.ctx.beginPath();

        // Draw a diamond/sparkle star shape
        const cx = this.x;
        const cy = this.y;
        const spikes = 4;
        const outerRadius = this.size;
        const innerRadius = this.size / 2.5;

        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // reset
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

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);


    function initParticles() {
        for (let i = 0; i < 40; i++) {
            particles.push(new SparkleParticle(ctx, canvas));
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.life <= 0) {
                particles[index] = new SparkleParticle(ctx, canvas);
            }
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// --------------------------------------------------
// SOUND TRIGGERS & NAV BUTTONS HOVER/CLICK ACTIONS
// --------------------------------------------------
menuItems.forEach(menu => {
    menu.addEventListener("mouseenter", () => {
        if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => console.log(e));
        }
    });

    menu.addEventListener("click", () => {
        const targetScreenId = menu.getAttribute("data-screen");
        if (targetScreenId) {
            if (isTransitioning) return;
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log(e));
            }
            switchToScreen(targetScreenId);
        }

        const targetLink = menu.getAttribute("data-link");
        if (targetLink) {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log(e));
            }
            window.open(targetLink, '_blank');
        }
    });
});

// Setup back buttons across all subpages
const backButtons = document.querySelectorAll(".p3-back-btn");
backButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => console.log(e));
        }
    });
    btn.addEventListener("click", () => {
        if (isTransitioning) return;
        if (exitSound) {
            exitSound.currentTime = 0;
            exitSound.play().catch(e => console.log(e));
        }
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
        void transitionOverlay.offsetWidth; // trigger reflow
        transitionOverlay.classList.add("trigger-wipe");

        setTimeout(() => {
            // Hide all screen nodes
            screens.forEach(s => {
                s.classList.remove("active");
                s.classList.add("hidden");
            });

            // Show current active loop state
            if (id === "main-menu-screen") {
                if (loop) loop.style.display = "block";
            } else {
                if (loop) loop.style.display = "none";
                if (intro) intro.style.display = "none";
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

cardWrappers.forEach(card => {
    card.addEventListener("click", () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }

        const imgPath = card.querySelector(".card").getAttribute("src");
        const category = card.getAttribute("data-category");
        const badge = card.getAttribute("data-badge");
        const skills = JSON.parse(card.getAttribute("data-skills"));
        const index = parseInt(card.getAttribute("data-index"));

        // Setup draw value & card numbers
        if (drawVal) drawVal.textContent = index + 1;
        const mainCardHolder = document.querySelector(".main-popout-card-holder");
        if (mainCardHolder) {
            const numLeft = mainCardHolder.querySelector(".top-left");
            const numRight = mainCardHolder.querySelector(".bottom-right");
            const cornerNum = card.querySelector(".corner-num").textContent;
            if (numLeft) numLeft.textContent = cornerNum;
            if (numRight) numRight.textContent = cornerNum;
        }

        // Fill out overlay values
        if (popoutImg) popoutImg.setAttribute("src", imgPath);
        if (popoutCategory) {
            popoutCategory.textContent = badge;
            // customize badge colors dynamically to match standard cards
            if (index === 0) popoutCategory.style.backgroundColor = "#ff4466";
            if (index === 1) popoutCategory.style.backgroundColor = "#f0c040";
            if (index === 2) popoutCategory.style.backgroundColor = "#00ddff";
            if (index === 3) popoutCategory.style.backgroundColor = "#44dd66";
        }

        if (popoutSkillsList) {
            popoutSkillsList.innerHTML = "";
            skills.forEach(skill => {
                const li = document.createElement("li");
                li.textContent = skill;
                popoutSkillsList.appendChild(li);
            });
        }

        // Show overlay with transition
        if (popoutOverlay) popoutOverlay.classList.add("active-popout");
    });
});

if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }
        if (popoutOverlay) popoutOverlay.classList.remove("active-popout");
    });
}

// Close popup on backdrop click as well
if (popoutOverlay) {
    popoutOverlay.addEventListener("click", (e) => {
        if (e.target === popoutOverlay) {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log(e));
            }
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
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }

        const title = pCard.getAttribute("data-title");
        const tech = pCard.getAttribute("data-tech");
        const desc = pCard.getAttribute("data-desc");
        const num = pCard.querySelector(".project-card-num").textContent;
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
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }
        if (projectOverlay) projectOverlay.classList.remove("active-popout");
    });
}

if (projectOverlay) {
    projectOverlay.addEventListener("click", (e) => {
        if (e.target === projectOverlay) {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log(e));
            }
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

function updateCommuSelection(index) {
    if (index < 0 || index >= commuItems.length) return;
    
    activeCommuIndex = index;

    commuItems.forEach((item, idx) => {
        if (idx === index) {
            item.classList.add("active-item");
            
            const name = item.querySelector(".commu-platform-name").textContent;
            const username = item.getAttribute("data-username");
            const desc = item.getAttribute("data-desc");
            const link = item.getAttribute("data-link");
            const bg = item.getAttribute("data-bg");

            if (detailName) detailName.textContent = name;
            if (detailUsername) detailUsername.textContent = username;
            if (detailDesc) detailDesc.textContent = desc;
            if (actionBtn) actionBtn.setAttribute("href", link);
            if (cardImg) cardImg.setAttribute("src", bg);
        } else {
            item.classList.remove("active-item");
        }
    });
}

commuItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
        if (activeCommuIndex !== index) {
            updateCommuSelection(index);
            if (hoverSound) {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(e => console.log(e));
            }
        }
    });

    item.addEventListener("click", () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }
        const link = item.getAttribute("data-link");
        window.open(link, "_blank");
    });
});

// --------------------------------------------------
// GLOBAL KEYBOARD SHORTCUTS
// --------------------------------------------------
document.addEventListener("keydown", (e) => {
    if (document.activeElement && (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable
    )) {
        return;
    }

    const contactMenu = document.getElementById("contact-menu");
    const isContactActive = contactMenu && contactMenu.classList.contains("active");

    if (isContactActive) {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            let prevIndex = (activeCommuIndex - 1 + commuItems.length) % commuItems.length;
            updateCommuSelection(prevIndex);
            if (hoverSound) {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(err => console.log(err));
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            let nextIndex = (activeCommuIndex + 1) % commuItems.length;
            updateCommuSelection(nextIndex);
            if (hoverSound) {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(err => console.log(err));
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(err => console.log(err));
            }
            const activeItem = commuItems[activeCommuIndex];
            if (activeItem) {
                const link = activeItem.getAttribute("data-link");
                window.open(link, "_blank");
            }
        }
    }

    if (e.key === "b" || e.key === "B") {
        if (isTransitioning) return;
        let actionTriggered = false;

        if (popoutOverlay && popoutOverlay.classList.contains("active-popout")) {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(err => console.log(err));
            }
            popoutOverlay.classList.remove("active-popout");
            actionTriggered = true;
        }

        if (projectOverlay && projectOverlay.classList.contains("active-popout")) {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(err => console.log(err));
            }
            projectOverlay.classList.remove("active-popout");
            actionTriggered = true;
        }

        if (!actionTriggered) {
            const activeScreen = document.querySelector(".screen.active");
            if (activeScreen && activeScreen.id !== "main-menu-screen") {
                if (exitSound) {
                    exitSound.currentTime = 0;
                    exitSound.play().catch(err => console.log(err));
                }
                switchToScreen("main-menu-screen");
            }
        }
    }
});