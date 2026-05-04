const intro = document.getElementById("intro")
const loop = document.getElementById("loop")
const audio = document.getElementById("audios")
const hover = document.getElementById("hovering")
const click = document.getElementById("clicking")
const menus = document.querySelectorAll('[class^="menu"]')



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