let button = document.getElementById('rollBtn')
let image1 = document.querySelector('.img1')
let image2 = document.querySelector('.img2')
let heading = document.querySelector('h1')

button.addEventListener('click',function(){
    let randomNumber1 = Math.floor(Math.random()*6)+1
    let randomNumber2 = Math.floor(Math.random()*6)+1
image1.setAttribute('src',`images/dice${randomNumber1}.png`)
image2.setAttribute('src',`images/dice${randomNumber2}.png`)

if(randomNumber1 > randomNumber2){
    heading.textContent = 'player 1 Wins 🚩'
    
}else if(randomNumber2>randomNumber1){
        heading.textContent = 'player 2 Wins 🚩'
}else{
    heading.textContent = 'Draw'
}



})