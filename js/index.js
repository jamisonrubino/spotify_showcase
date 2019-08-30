// css flex grid for users
// grab uri parameter "code" from Spotify callback, create cookie

// how to load users
// 	hidden search bar that adds users to a txt file which is loaded into js file
// 		advantages: no new heroku uploads for each list update
//	hard code the list into JS (users array)
//		downside: reupload to heroku with every users list change
// 	find user on spotify
//		(...) -> copy spotify URI
// fix login cookie
// add user list
// troubleshoot fetch functions


var userHTML = "",
	playlistsHTML = "",
	users = ['1UfzhwcOR4yfX7yHTPfC9m', '6TLwD7HPWuiOzvXEa3oCNe', '0MmPL9gu4CqApuGB28aT9d'],
	authCode = "",
	usersDiv = document.getElementById('users'),
	musicDiv = document.getElementById('music'),
	loginDiv = document.getElementById('login'),
	webPlayer = document.getElementById('webplayer');

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

setAuthCookies();
// check if the user has been authorized by Spotify
if (authCode.length > 0) {
	fetchUsers();
	loginDiv.style.display = "none";
	usersDiv.style.display = "grid";
	musicDiv.style.display = "grid";
	webPlayer.style.display = "grid";
} else {
	loginDiv.style.display = "block";
}



//=======================================
//==============FETCH FUNCTIONS

// // fetch all user objects
function fetchUsers() {
	for (let i=0; i<users.length; i++) {
		var user = fetchUser(users[i]);
		console.log(user)
		userHTML += `<div class="user" onclick="fetchPlaylists('${user.id}')">${user.display_name}</div>`;
	}
	usersDiv.innerHTML = usersHTML;
}

// fetch a single user object
function fetchUser(selectedUser, user = null) {
	fetch(`https://api.spotify.com/v1/users/${selectedUser}`, {'Authorization': `Bearer ${authCode}`})
		.then(response => user = response.json())
	return user;
}

// fetch a list of playlists
function fetchPlaylists(selectedUser, playlists = null) {
	playlistsHTML = "";
	fetch(`https://api.spotify.com/v1/users/${selectedUser}/playlists`, {'Authorization': `Bearer ${authCode}`})
		.then(response=>playlists=(response.json()).items)
	console.log('playlists', playlists);
	let i = -1;
	while (i++ < playlists.length && i < 50) {
		playlistsHTML += `<div class="playlists" onclick="loadPlaylist('${playlists[i].id}')">${playlists[i].name} - ${playlists[i].tracks.total}</div>`;
		console.log("playlist", playlists[i])
	}
}

function loadPlaylist(playlist) {
	webPlayer.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${playlist}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
}

// fetch a single playlist
// function fetchPlaylist(playlist) {
// 	fetch(`https://api.spotify.com/v1/playlists/${playlist}`, {'Authorization': `Bearer ${authCode}`})
// 		.then(response=>response.json())
// 		.then(resJson=>{
// 			playlistURI =
// 		})
// }




//=======================================
//==============COOKIES

function setAuthCookies() {
	authCode = (new URL(window.location.href)).searchParams.get("code")
	if (authCode.length>0)
		document.cookie = `authCode=${authCode}`;
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
