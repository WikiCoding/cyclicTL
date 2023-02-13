//const url = 'https://ill-pink-mite-veil.cyclic.app'
const url = 'https://cyclictl.cyclic.app'

const userLoggedIn = async () => {
  const fetchUser = await fetch(`${url}/loggedUser`, {
    method: 'GET'
  })
  const loggedIn = await fetchUser.json();

  const token = document.cookie.replace('auth_token=', '');

  if (loggedIn.tokens[0].token === token) {
    location.href = '/todos';
  }
}

if (document.cookie) {
  userLoggedIn();
}
