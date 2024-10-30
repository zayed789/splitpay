import React, { useState } from "react";
import Main from "./main";
import "./styles.css";
function App() {
  return (
    <>
<header>
  <div class="wrapper">
    <h1 class="logo">SPLIT<span>Pay</span></h1>
    <nav class="main-nav">
      <ul>
        <li><a href="#"><i class="fa fa-home nav-icon"></i>Home</a></li>
        <li><a href="#"><i class="fa fa-info nav-icon"></i>About</a></li>
        <li><a href="#"><i class="fa fa-usd nav-icon"></i>Login</a></li>
        <li><a href="#"><i class="fa fa-pencil nav-icon"></i>Signup</a></li>
      </ul>
    </nav>
    
    <div class="menu-toggle">
      <div class="hamburger"></div>
    </div>
    
  </div>
</header>
      <Main />
    </>
  );
}

export default App;