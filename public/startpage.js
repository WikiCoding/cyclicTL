const url = 'http://localhost:3000'

const userLoggedIn = async () => {
  const token = document.cookie.replace('auth_token=', '');
  const fetchUser = await fetch(`${url}/loggedUser`, {
    method: 'GET'
  })
  const loggedIn = await fetchUser.json();

  if (loggedIn.tokens[0].token === token) {
    location.href = '/todos';
  }
}

if (document.cookie) {
  userLoggedIn();
}
