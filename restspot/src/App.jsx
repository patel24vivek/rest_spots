import React from 'react'
import {BrowserRouter,Routes ,Route} from 'react-router-dom'
import Map from './pages/Map'
import AddPlace from './pages/AddPlace'
import About from './pages/About'
import Home from './pages/Home'
import FindPlace from './pages/FindPlace'

const App = () => {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/map" element={<Map />} />
        <Route path="/add" element={<AddPlace />} />
        <Route path="/about" element={<About />} />
        <Route path="/findplace" element={<FindPlace />} />

      </Routes>
    </BrowserRouter> 
    </div>
  )
}

export default App
