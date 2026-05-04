const intro = document.getElementById("intro")
const loop = document.getElementById("loop")
const audio = document.getElementById("audios")

 
intro.src = "./assets/makoto.mp4"
loop.src = "./assets/makoto_loop.mp4"

//biar loop ke hide dulu, entah kenapa loopnya didepan intro wak
loop.style.display = "none";

intro.addEventListener("canplay", () => {
    intro.play()
})

// intro siap langsung loop
intro.addEventListener("ended", () => {
    intro.style.display = "none";
    loop.style.display = "block";
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
    intro.pause();
    loop.pause();
    audios.pause();

    intro.currentTime = 0;
    loop.currentTIme = 0;
    audios.currentTime =0;

    intro.play();
    audios.play();

}

audios.volume = 0.2;