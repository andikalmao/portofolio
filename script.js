// --------------------------------------------------
// P3R AUDIO & VIDEOS DOM SELECTORS
// --------------------------------------------------
const intro = document.getElementById("intro");
const loop = document.getElementById("loop");
const bgMusic = document.getElementById("audios");
const hoverSound = document.getElementById("hovering");
const clickSound = document.getElementById("clicking");

// Main menu navigation items
const menuItems = document.querySelectorAll('[class^="menu"]');
const screens = document.querySelectorAll(".screen");
const transitionOverlay = document.getElementById("page-transition-overlay");

// Audio volume control setups
if (bgMusic) bgMusic.volume = 0.45;
if (hoverSound) hoverSound.volume = 0.55;
if (clickSound) clickSound.volume = 0.65;

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

    // Handle track ended -> play next
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

    class SparkleParticle {
        constructor() {
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
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0) {
                this.y = canvas.height;
                this.life = this.maxLife;
            }
        }

        draw() {
            const alpha = Math.sin((this.life / this.maxLife) * Math.PI); // fade in/out
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = this.color.includes("240") ? "#f0c040" : "#00ddff";
            ctx.fillStyle = `${this.color}${alpha})`;
            ctx.beginPath();
            
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

            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }
    }

    function initParticles() {
        for (let i = 0; i < 40; i++) {
            particles.push(new SparkleParticle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.life <= 0) {
                particles[index] = new SparkleParticle();
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
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }
        
        const targetScreenId = menu.getAttribute("data-screen");
        if (targetScreenId) {
            switchToScreen(targetScreenId);
        }

        const targetLink = menu.getAttribute("data-link");
        if (targetLink) {
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
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }
        switchToScreen("main-menu-screen");
    });
});

// Switch screens with wipe animation transitions
function switchToScreen(id) {
    if (transitionOverlay) {
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
            const target = document.getElementById(id);
            if (target) {
                target.classList.remove("hidden");
                target.classList.add("active");
            }
        }, 500); // exactly at mid point of wipe transition
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

        if (projDetailNum) projDetailNum.textContent = num;
        if (projDetailTitle) projDetailTitle.textContent = title;
        if (projDetailTech) projDetailTech.textContent = tech;
        if (projDetailDesc) projDetailDesc.textContent = desc;

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
// PAGE 5: PHONE MESSENGER CUSTOM INTERACTIONS
// --------------------------------------------------
const contactForm = document.getElementById("contact-p3-form");
const chatBox = document.getElementById("phone-chat-box");

if (contactForm && chatBox) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById("c-name");
        const emailInput = document.getElementById("c-email");
        const msgInput = document.getElementById("c-message");

        if (nameInput.value.trim() === "" || msgInput.value.trim() === "") return;

        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        }

        // Add user message bubble
        const userBubble = document.createElement("div");
        userBubble.className = "chat-bubble sent";
        userBubble.innerHTML = `
            <div class="chat-bubble-content">${msgInput.value}</div>
            <span class="chat-time-stamp">Just Now</span>
        `;
        chatBox.appendChild(userBubble);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Clear input form message text area only (keep name & email filled)
        msgInput.value = "";

        // Trigger mock reply message after delay
        setTimeout(() => {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log(e));
            }

            const responseBubble = document.createElement("div");
            responseBubble.className = "chat-bubble received";
            responseBubble.innerHTML = `
                <div class="chat-bubble-content">Understood. Your information has been cached. I'll get back to you soon.</div>
                <span class="chat-time-stamp">Just Now</span>
            `;
            chatBox.appendChild(responseBubble);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1200);
    });
}

// --------------------------------------------------
// GLOBAL KEYBOARD SHORTCUTS (e.g. B to go back/cancel)
// --------------------------------------------------
document.addEventListener("keydown", (e) => {
    // Ignore keypresses if user is typing in inputs or textareas
    if (document.activeElement && (
        document.activeElement.tagName === "INPUT" || 
        document.activeElement.tagName === "TEXTAREA" || 
        document.activeElement.isContentEditable
    )) {
        return;
    }

    if (e.key === "b" || e.key === "B") {
        let actionTriggered = false;

        // Check if skills popout is open
        if (popoutOverlay && popoutOverlay.classList.contains("active-popout")) {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(err => console.log(err));
            }
            popoutOverlay.classList.remove("active-popout");
            actionTriggered = true;
        }

        // Check if project popout is open
        if (projectOverlay && projectOverlay.classList.contains("active-popout")) {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(err => console.log(err));
            }
            projectOverlay.classList.remove("active-popout");
            actionTriggered = true;
        }

        // If no popout was open, check if we are in a subpage menu and go back to main menu
        if (!actionTriggered) {
            const activeScreen = document.querySelector(".screen.active");
            if (activeScreen && activeScreen.id !== "main-menu-screen") {
                if (clickSound) {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(err => console.log(err));
                }
                switchToScreen("main-menu-screen");
            }
        }
    }
});