// App.js
import React, { useState } from "react";
import Home from "./components/Home";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        {/* <Route path="/compare" component={CompareAlgorithms}></Route> */}
      </Switch>
    </div>
  );
}

export default App;
