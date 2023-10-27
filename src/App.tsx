import { useState } from "react";
import "./App.css";
import RubiksCubeCanvas from "./RubiksCubeCanvas";

function App() {
  return (
    <>
      <h1>Rubik's Cube</h1>
      <RubiksCubeCanvas />
    </>
  );
}

export default App;
