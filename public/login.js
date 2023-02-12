const login = document.querySelector('.login-btn');
const usernameInput = document.querySelector('.usernameClass');
const passInput = document.querySelector('.passwordClass');
const chk = document.querySelector('.chk');

chk.addEventListener('click', () => {
  if (passInput.type === 'password') {
    passInput.setAttribute('type', 'text');
  } else {
    passInput.setAttribute('type', 'password');
  }
});


const url = 'http://localhost:3000/'

login.addEventListener('click', async (e) => {
  e.preventDefault();
  const jsonBody = {};
  jsonBody.username = usernameInput.value;
  jsonBody.password = passInput.value;

  try {
    let result = await fetch(`${url}login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(jsonBody)
    });

    const data = await result.json();

    location.href = `/todos`
  } catch (e) {
    alert('Could not login');
  }
})
