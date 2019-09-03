const users = ['5vphzswukltgasui8ytdujtdv', '5vphzswukltgasui8ytdujtdv', '5vphzswukltgasui8ytdujtdv'],
	clientID = `b0c1136a86af4a779098455e2d3c61bd`,
	redirectURI = `https://spotify-showcase.herokuapp.com/`;

var usersHTML = "",
	playlistsHTML = "",
	user,
	playlists,
	accessToken,
	usersDiv = document.getElementById('users'),
	musicDiv = document.getElementById('music'),
	loginDiv = document.getElementById('login'),
	webPlayer = document.getElementById('webplayer');

function authorize() {
	var scopes = 'streaming user-read-email user-follow-read';
	window.location.replace('https://accounts.spotify.com/authorize' +
	'?response_type=token' + '&client_id=' + clientID + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + '&redirect_uri=' + encodeURIComponent(redirectURI)) + '&state=123';
}

if (window.location.href.indexOf('access_token') > -1 && getCookie('access_token').length == 0)
	setAuth();

if (getCookie('access_token').length > 0) {
	fetchUsers();
	loginDiv.style.display = "none";
	usersDiv.style.display = "inline-block";
	musicDiv.style.display = "inline-block";
	webPlayer.style.display = "inline-block";
} else {
	loginDiv.style.display = "block";
}



//=============================
//==============FETCH FUNCTIONS

// fetch all user objects
async function fetchUsers() {
	for (let i=0; i<users.length; i++) {
	 	await fetchUser(`${users[i]}`);
		console.log(user)
		usersHTML += `<div class="user" onclick="fetchPlaylists('${user.id}')">${user.display_name}</div>`;
	}
	usersDiv.innerHTML = usersHTML;
}

// fetch a single user object
function fetchUser(selectedUser) {
	return fetch(`https://api.spotify.com/v1/users/${selectedUser}`, {headers: {'Authorization': `Bearer ${getCookie('access_token')}`}})
		.then(response => response.json())
		.then(userRes => user = userRes)
}

// fetch a list of playlists
function fetchPlaylists(selectedUser) {
	musicDiv.innerHTML = "";
	playlists = null;
	playlistsHTML = "";
	fetch(`https://api.spotify.com/v1/users/${selectedUser}/playlists`, {headers: {'Authorization': `Bearer ${getCookie('access_token')}`}})
		.then(response => response.json())
		.then(res => {
			playlists = res.items;
			for (let i=0; i<playlists.length; i++) {
				playlistsHTML += `<div class="playlist" onclick="loadPlaylist('${playlists[i].id}')">${playlists[i].name} - ${playlists[i].tracks.total}</div>`;
				console.log("playlist", playlists[i])
			}
			musicDiv.innerHTML = playlistsHTML;
		})
}

// load a playlist into Spotify web player
function loadPlaylist(playlist) {
	webPlayer.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${playlist}" width="350" height="480" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
}



//=====================================
//==============GET AND SET AUTH COOKIE

function setAuth() {
	var url = window.location.href
	accessToken = url.slice(url.indexOf('=')+1, url.indexOf('&'))

	let now = new Date(),
		expiration = now.getTime() + 3600000
	now.setTime(expiration)
	document.cookie = "access_token=" + accessToken + "; expires=" + now.toGMTString() + "; path=/";
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
