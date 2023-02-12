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
  //jsonBody.email = emailInput.value;
  jsonBody.password = passInput.value;
  //jsonBody.tokens = [{ token: '' }];
  console.log(jsonBody);
  let result = await fetch(`http://localhost:3000/signup`, {
    method: 'POST',
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonBody)
  });
  const data = await result.json();
  console.log(data, 'from app');
  if (data !== undefined) {
    alert('User succesfully created!')
  }
  location.href = '/todos';
})