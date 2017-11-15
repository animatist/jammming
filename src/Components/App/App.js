import React from 'react';
import './App.css';
import Spotify from '../../util/Spotify';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        searchResults: [],
        playlistName:'My playlist',
        playlistTracks:[]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
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
    this.setState({playlistName: 'New Playlist',playlistTracks: []})
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
              onAdd={this.addTrack}
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
