const url = 'https://cyclictl.cyclic.app';
//const url = 'https://ill-pink-mite-veil.cyclic.app'

const chk = document.querySelector('.chk');

chk.addEventListener('click', () => {
  if (passInput.type === 'password') {
    passInput.setAttribute('type', 'text');
  } else {
    passInput.setAttribute('type', 'password');
  }
});

const signup = document.querySelector('.signup-btn');
const usernameInput = document.querySelector('.name-input');
const emailInput = document.querySelector('.email-input');
const passInput = document.querySelector('.pass-input');

signup.addEventListener('click', async (e) => {
  e.preventDefault();
  const jsonBody = {};
  jsonBody.username = usernameInput.value;

  jsonBody.password = passInput.value;

  let result = await fetch(`${url}/signup`, {
    method: 'POST',
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonBody)
  });
  const data = await result.json();

  if (data !== undefined) {
    alert('User succesfully created!')
  }
  location.href = '/todos';
})
