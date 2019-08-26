console.log('update: redirectURI after heroku')

// css flex grid for users
//

var userHTML = "",
	playlistHTML = "",
	users = [],
	authToken = "",
	users = document.getElementById('users'),
	music = document.getElementById('music'),
	loginDiv = document.getElementById('login');

const clientID = `b0c1136a86af4a779098455e2d3c61bd`,
	clientSecret = ``,
	redirectURI = `https://spotify-showcase.herokuapp.com/`;

function authenticate() {
	// fetch('https://accounts.spotify.com/api/token', {
	// 	method: 'POST',
	// 	body: {
	// 		'grant_type': 'client_credentials'
	// 	},
	// 	headers: {
	// 		'Content-Type': 'application/x-www-form-urlencoded'
	// 	}
	// })
	var scopes = 'streaming user-read-email user-follow-read playlist-read-collaborative playlist-read-private';
	window.location.replace('https://accounts.spotify.com/authorize' +
  '?grant_type=client_credentials&response_type=code' + '&client_id=' + clientID + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + '&redirect_uri=' + encodeURIComponent(redirectURI));
}

if (authToken.length > 0) {
	// fetchUsers();
	loginDiv.style.display = "none";
	users.style.display = "grid";
	music.style.display = "grid";
	users.innerHTML = userHTML;
} else {
	loginDiv.style.display = "block";
}



//=======================================
//==============FETCH FUNCTIONS

// fetch all user objects
function fetchUsers() {
	for (let i=0; i<users.length; i++) {
		var user = fetchUser(users[i]);
		userHTML += `<div class="user" onclick="fetchPlaylists(${user.id})">${user.display_name}</div>`;
	}
}

// fetch a single user object
function fetchUser(selectedUser) {
	var user;
	fetch(`https://api.spotify.com/v1/users/${selectedUser}`, {'Authorization': `Bearer ${authToken}`})
		.then(response=>response.json())
		.then(resJson=>{
			user = resJson;
		})
	return user;
	// id, images[0].height, images[0].url, images[0].width
}

// fetch a single playlist
function fetchPlaylist(playlist) {
	fetch(`https://api.spotify.com/v1/playlists/${playlist}`, {'Authorization': `Bearer ${authToken}`})
		.then(response=>response.json())
		.then(resJson=>{
		})
}

// fetch a list of playlists
function fetchPlaylists(selectedUser) {
	var playlists;
	fetch(`https://api.spotify.com/v1/users/${selectedUser}/playlists`, {'Authorization': `Bearer ${authToken}`})
		.then(response=>response.json())
		.then(resJson=>{
			playlists = resJson.items;
		})
	playlists = resJson.items;
}


//=======================================
//==============COOKIES

function setAuthCookies() {
	document.cookie = `authToken=${authToken}`;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
