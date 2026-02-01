let alphabets ='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let container = document.getElementById('buttonGrid')

alphabets.split('').forEach((letter) => {
let button = document.createElement('button')
button.textContent =letter
button.addEventListener('click',function(event){
    playSound(event.target.innerText)
})
container.appendChild(button)


})
function playSound(letter){
    let audio = new Audio(`./sounds/${letter}.wav`)
    audio.play()
}

document.body.addEventListener('keydown',function(event){
    playSound(event.key)
})