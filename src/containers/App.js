import React, { Component } from 'react';
import "./App.scss";

class App extends Component {
  constructor(props) {     
    super(props);     
    this.state = { error: false };
  }
  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>
    );
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.log(info);
  }
}

export default App;
