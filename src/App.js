import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./assets/styles/index.scss"
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Gallery from "./pages/Gallery";
import Book from "./pages/Book";
import LogIn from "./pages/LogIn";
import NotFound from "./pages/NotFound";
import User from "./pages/User";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="galerie" element={<Gallery />} />
          <Route path="reserver" element={<Book />} />
          <Route path="se-connecter" element={<LogIn/>} />
          <Route path="profil" element={<User/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
