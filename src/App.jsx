import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AboutUs from './routes/About'
import Contact from './routes/Contact'
import Demo from './routes/Demo'
import Home from './routes/Home'

const App = () => {
	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/demo'
					element={<Demo />}
				/>
				<Route
					path='/contact'
					element={<Contact />}
				/>
				<Route
					path='/about'
					element={<AboutUs />}
				/>
			</Routes>
		</Router>
	)
}

export default App
