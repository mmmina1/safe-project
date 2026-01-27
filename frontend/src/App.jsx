import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<h2 style={{padding: '50px'}}>메인 페이지 내용</h2>} />
          <Route path="/shop" element={<h2 style={{padding: '50px'}}>쇼핑 페이지 내용</h2>} />
        </Route>
      </Routes>    
    </BrowserRouter>
  )
}

export default App
