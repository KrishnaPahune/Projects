let lowercase = 'abcdefghijklnopqrstuvwxyz'
let uppercase = 'ABCDEFGHIJKLNOPQRSTUVWXYZ'
let digits = '0123456789'
let symbol = '!@#$%^&*():"<>?|'

let allcharacters = lowercase + uppercase + digits +symbol


let password =''
let button = document.querySelector('button')
let passwordField =document.getElementById('passwor')

password = password + lowercase[Math.floor(Math.random()*lowercase.length)]
password = password + uppercase[Math.floor(Math.random()*uppercase.length)]
password = password + digits[Math.floor(Math.random()*digits.length)]
password = password + symbol[Math.floor(Math.random()*symbol.length)]



for (i=0; i<6; i++){
    let randomIndex = Math.floor(Math.random()*allcharacters.length)
    password = password + allcharacters[randomIndex]
}
button.addEventListener('click',function(){
    inputeBox.value = password

})
console.log(password)