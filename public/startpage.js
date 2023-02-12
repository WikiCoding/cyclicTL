// window.addEventListener('load', (e) => {
//   e.preventDefault();

//   const cookie = document.cookie;
//   if (cookie) {
//     location.href = '/todos';
//   }
//   else {
//     location.href = '/';
//   }
//   //add condition for expired/invalid cookie
// })

const url = 'https://cyclictl.cyclic.app';

const startPage = async () => {
  let result = await fetch(`${url}/`, {
    method: 'GET'
  })

  const data = await result.json();
  console.log(data);
  if (data) {
    location.href = '/todos';
  } else {
    alert(data.message)
    location.href = '/';
  }
}

const checkLoggedIn = async () => {
  let result = await fetch(`${url}/todos`, {
    method: 'GET'
  })

  const data = await result.json();
  console.log(data);
  if (data.message !== 'No user') {
    location.href = '/todos';
  } else {
    alert(data.message)
    location.href = '/';
  }
}

//checkLoggedIn();
