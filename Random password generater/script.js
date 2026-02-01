const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const digits = '0123456789'
const symbol = '!@#$%^&*():"<>?|' 

const allCharacters = lowercase + uppercase + digits + symbol

const button = document.querySelector('button')
const passwordField = document.getElementById('password')

function generatePassword() {
  let password = ''

  // ensure at least one char from each set
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += digits[Math.floor(Math.random() * digits.length)]
  password += symbol[Math.floor(Math.random() * symbol.length)]

  // add random chars to reach desired length (10 total here)
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length)
    password += allCharacters[randomIndex]
  }

  // shuffle so required chars aren't always at the start
  return password.split('').sort(() => 0.5 - Math.random()).join('')
}

button.addEventListener('click', function () {
  const pwd = generatePassword()
  passwordField.value = pwd
  console.log(pwd)
})