const intro = document.getElementById("intro")
const loop = document.getElementById("loop")
const audio = document.getElementById("audios")
const hover = document.getElementById("hovering")
const click = document.getElementById("clicking")
const menus = document.querySelectorAll('[class^="menu"]')

document.querySelector(".menu1").onclick = () => switchTo("skills-menu")
document.querySelector(".menu2").onclick = () => switchTo("projects-menu")
document.querySelector(".menu3").onclick = () => switchTo("contact-menu")
document.querySelector(".menu5").onclick = () => switchTo("about-menu")
document.querySelector(".menu4").onclick = () => {
  window.open("https://github.com/andikalmao");
};



audio.volume = 0.5
hover.volume = 0.7
audio.volume = 0.7
 
intro.src = "./assets/makoto.mp4"
loop.src = "./assets/makoto_loop.mp4"

//biar loop ke hide dulu, entah kenapa loopnya didepan intro wak
loop.style.display = "none"

intro.addEventListener("canplay", () => {
    intro.play()
})

// intro siap langsung loop
intro.addEventListener("ended", () => {
    intro.style.display = "none"
    loop.style.display = "block"
    loop.play() 

})

// jujur lupa buat apa sih ini
window.addEventListener("canplay", () => {
    setTimeout(() => {
        intro.play()
    }, 4700)
})

// restart kalo refresh
function restart() {
    intro.pause()
    loop.pause()
    audios.pause()

    intro.currentTime = 0
    loop.currentTime = 0
    audios.currentTime =0

    intro.play()
    audios.play()

}

// menu click sound
menus.forEach(menu => {
    menu.addEventListener("mouseenter", () => {
        hover.currentTime = 0;
        hover.play();
    });

    menu.addEventListener("click", () => {
        click.currentTime = 0;
        click.play();
    });
});

// page work

const screens = document.querySelectorAll(".screen");

function switchTo(id) {
    screens.forEach(s => {
        s.classList.remove("active");
        s.classList.add("hidden");
    });

    const target = document.getElementById(id);
    target.classList.remove("hidden");
    target.classList.add("active");
}

// const cards = document.querySelectorAll(".card");

// cards.forEach(card => {
//   card.addEventListener("click", () => {
//     cards.forEach(c => c.classList.remove("active"));
//     card.classList.add("active");

//   });
// });