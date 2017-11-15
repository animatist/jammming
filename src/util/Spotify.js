const clientId = '36b4aa0b9b2344b5b9765d94e1694ff7';
const redirectUri = 'http://localhost:3000/';
let accessToken;
let expiresIn;
const Spotify = {
  getAccessToken(){
    if (accessToken){
      return accessToken;
    }
    const urlAccesToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if(urlAccesToken && urlExpiresIn){
      accessToken = urlAccesToken[1];
      expiresIn = urlExpiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(term){
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => response.json()
  ).then(jsonResponse => {
    if (!jsonResponse.tracks) return [];
    return jsonResponse.tracks.items.map(track => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }
    })
   })
 },

 savePlaylist(name, trackUris){
   if(!name || !trackUris) return;
   const headers = {Authorization: `Bearer ${accessToken}`};
   let userId;
   let playlistId;

   return fetch('https://api.spotify.com/v1/me', {
     headers: headers
   }).then(response => response.json())
   .then(jsonResponse => userId = jsonResponse.id)
   .then(() => {
     const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
     fetch(createPlaylistUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: name
          })
        })
        .then(response => response.json())
        .then(jsonResponse => playlistId = jsonResponse.id)
        .then(() => {
          const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
          fetch(addPlaylistTracksUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              uris: trackUris
            })
          });
         })
    })
  }
}

export default Spotify;
