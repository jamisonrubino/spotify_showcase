const users = ['5vphzswukltgasui8ytdujtdv', '5vphzswukltgasui8ytdujtdv', '5vphzswukltgasui8ytdujtdv'],
	clientID = `b0c1136a86af4a779098455e2d3c61bd`,
	redirectURI = `https://spotify-showcase.herokuapp.com/`;

var usersHTML = "",
	playlistsHTML = "",
	user,
	playlists,
	accessToken,
	usersDiv = document.getElementById('users'),
	playlistsDiv = document.getElementById('playlists'),
	loginDiv = document.getElementById('login'),
	webPlayer = document.getElementById('webplayer');


//==========================================
//======================PAGE LOAD AUTH CHECK

// if redirected here with access_token but cookie not set, set cookie value
if (window.location.href.indexOf('access_token') > -1 && getCookie('access_token').length == 0)
	setAuth();

// if cookie set, hide login button, begin info fetching and make HTML sections visible
if (getCookie('access_token').length > 0) {
	fetchUsers();
	loginDiv.style.display = "none";
	usersDiv.style.display = "inline-block";
	playlistsDiv.style.display = "inline-block";
	webPlayer.style.display = "inline-block";
} else {
	loginDiv.style.display = "block";
}



//====================================
//======================LOGIN REDIRECT

// triggered by 'login' button click
function authorize() {
	var scopes = 'streaming user-read-email user-follow-read';
	window.location.replace('https://accounts.spotify.com/authorize' +
	'?response_type=token' + '&client_id=' + clientID + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + '&redirect_uri=' + encodeURIComponent(redirectURI)) + '&state=123';
}


//=============================================
//======================GET AND SET AUTH COOKIE

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


//=====================================
//======================FETCH FUNCTIONS

// call fetchUser for each user in users list
// fetchUser queries Spotify for the user's public info and returns it here
// add new 'div' block to usersHTML for current user
async function fetchUsers() {
	for (let i=0; i<users.length; i++) {
	 	await fetchUser(`${users[i]}`);
		usersHTML += `<div class="user" onclick="fetchPlaylists('${user.id}')">${user.display_name}</div>`;
	}
	usersDiv.innerHTML = usersHTML;
}

// query Spotify for a user's public info
// convert the returned string to an object with .json()
// then assign object to global var "user"
function fetchUser(selectedUser) {
	return fetch(`https://api.spotify.com/v1/users/${selectedUser}`, {headers: {'Authorization': `Bearer ${getCookie('access_token')}`}})
		.then(response => response.json())
		.then(userRes => user = userRes)
}

// reset playlistsDiv's HTML to an empty string
// query Spotify for a user's public playlists
// convert json string server response to object
// for each playlist, add clickable div to playlistsHTML with its info
// update playlistsDiv's HTML to fit the new playlists list
function fetchPlaylists(selectedUser) {
	playlistsDiv.innerHTML = "";
	playlists = null;
	playlistsHTML = "";
	fetch(`https://api.spotify.com/v1/users/${selectedUser}/playlists`, {headers: {'Authorization': `Bearer ${getCookie('access_token')}`}})
		.then(response => response.json())
		.then(res => {
			playlists = res.items;
			for (let i=0; i<playlists.length; i++) {
				playlistsHTML += `<div class="playlist" onclick="loadPlaylist('${playlists[i].id}')">${playlists[i].name} - ${playlists[i].tracks.total}</div>`;
			}
			playlistsDiv.innerHTML = playlistsHTML;
		})
}

// accept a playlist id
// incorporate playlist ID in webplayer's URL and reload webplayer
function loadPlaylist(playlist) {
	webPlayer.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${playlist}" width="350" height="480" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
}
