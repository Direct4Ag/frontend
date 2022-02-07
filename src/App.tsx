import React from "react";
import logo from "./images/logo.png";
import "./styles/App.css";
import Welcome from "./components/Welcome";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" />
          <Welcome/>
      </header>
    </div>
  );
}

export default App;
