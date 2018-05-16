import * as React from 'react';
import './App.css';
import Navbar from './components/Navbar';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Navbar />
        <h1>My React App</h1>
      </div>
    );
  }
}

export default App;
