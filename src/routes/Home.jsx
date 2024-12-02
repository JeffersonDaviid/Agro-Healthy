import React from 'react'
import { Link } from 'react-router-dom'
import { FaWater, FaCloudSun, FaSeedling } from 'react-icons/fa'
import NavBar from '../components/NavBar'

const Main = () => {
	return (
		<div className='min-h-screen bg-green-50'>
			<NavBar />

			{/* Hero Section */}
			<section className='bg-green-700 text-white py-20'>
				<div className='container mx-auto text-center'>
					<h2 className='text-4xl font-bold mb-4'>AI-Powered Water Management</h2>
					<p className='text-xl mb-8'>
						Revolutionizing agriculture with smart water solutions
					</p>
					<Link
						to='/demo'
						className='bg-white text-green-700 py-2 px-6 rounded-full text-lg font-semibold hover:bg-green-100 transition duration-300'>
						Try Demo
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-16'>
				<div className='container mx-auto'>
					<h3 className='text-3xl font-bold text-center mb-12'>Our Solutions</h3>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<FeatureCard
							icon={<FaWater className='text-4xl mb-4 text-blue-500' />}
							title='Water Risk Assessment'
							description='AI-driven analysis to identify and mitigate water-related risks in your crops.'
						/>
						<FeatureCard
							icon={<FaCloudSun className='text-4xl mb-4 text-yellow-500' />}
							title='Drought Prevention'
							description='Predictive modeling to forecast and prevent drought conditions before they occur.'
						/>
						<FeatureCard
							icon={<FaSeedling className='text-4xl mb-4 text-green-500' />}
							title='Smart Irrigation'
							description='Optimize water usage with AI-controlled irrigation systems tailored to your crops.'
						/>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className='bg-green-600 text-white py-16'>
				<div className='container mx-auto text-center'>
					<h3 className='text-3xl font-bold mb-4'>Ready to Transform Your Farm?</h3>
					<p className='text-xl mb-8'>
						Join the agricultural revolution and maximize your water efficiency today.
					</p>
					<Link
						to='/signup'
						className='bg-white text-green-700 py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-100 transition duration-300'>
						Get Started
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className='bg-green-800 text-white py-8'>
				<div className='container mx-auto text-center'>
					<p>&copy; 2024 AgroTech AI. All rights reserved.</p>
				</div>
			</footer>
		</div>
	)
}

const FeatureCard = ({ icon, title, description }) => {
	return (
		<div className='bg-white p-6 rounded-lg shadow-md text-center'>
			{icon}
			<h4 className='text-xl font-semibold mb-2'>{title}</h4>
			<p className='text-gray-600'>{description}</p>
		</div>
	)
}

export default Main
