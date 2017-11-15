import React from 'react';
import Spotify from '../../util/Spotify';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        searchResults: [],
        playlistName:'My playlist',
        playlistTracks:[]
    };
    this._bind('addTrack','removeTrack','updatePlaylistName','savePlaylist','search')
  }

  addTrack(track){
    this.state.playlistTracks.forEach(checkTrack => {
      if(track.id !== checkTrack.id){
        let newList = this.state.playlistTracks;
        newList.push(track);
        this.setState({playlistTracks: newList});
      }
    })
  }

  removeTrack(track){
    let newList = this.state.playlistTracks.filter(
      checkTrack => track.id !== checkTrack.id
    );
    this.setState({playlistTracks: newList});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist',searchResults: []})
  }

  search(term){
    Spotify.search(term)
    .then(searchResults => this.setState({
      searchResults: searchResults
    }));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist
              name = {this.state.playlistName}
              tracks = {this.state.playlistTracks}
              onRemove = {this.removeTrack}
              onNameChange = {this.updatePlaylistName}
              onSave ={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
