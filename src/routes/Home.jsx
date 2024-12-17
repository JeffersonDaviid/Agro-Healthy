import React from 'react'
import { Link } from 'react-router-dom'
import { FaWater, FaCloudSun, FaSeedling } from 'react-icons/fa'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const Main = () => {
	return (
		<div className='min-h-screen bg-green-50'>
			<NavBar />

			{/* Hero Section */}
			<section className='py-20 text-white bg-green-700'>
				<div className='container mx-auto text-center'>
					<h2 className='mb-4 text-4xl font-bold'>AI-Powered Water Management</h2>
					<p className='mb-8 text-xl'>
						Revolutionizing agriculture with smart water solutions
					</p>
					<Link
						to='/demo'
						className='px-6 py-2 text-lg font-semibold text-green-700 transition duration-300 bg-white rounded-full hover:bg-green-100'>
						Try Demo
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-16'>
				<div className='container mx-auto'>
					<h3 className='mb-12 text-3xl font-bold text-center'>Our Solutions</h3>
					<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
						<FeatureCard
							icon={<FaWater className='mb-4 text-4xl text-blue-500' />}
							title='Soil Moisture'
							description='AI-driven analysis to identify and mitigate water-related risks in your crops.'
						/>
						<FeatureCard
							icon={<FaCloudSun className='mb-4 text-4xl text-yellow-500' />}
							title='Drought Prevention'
							description='Predictive modeling to forecast and prevent drought conditions before they occur.'
						/>
						<FeatureCard
							icon={<FaSeedling className='mb-4 text-4xl text-green-500' />}
							title='Smart Irrigation'
							description='Optimize water usage with AI-controlled irrigation systems tailored to your crops.'
						/>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className='py-16 text-white bg-green-600'>
				<div className='container mx-auto text-center'>
					<h3 className='mb-4 text-3xl font-bold'>Ready to Transform Your Farm?</h3>
					<p className='mb-8 text-xl'>
						Join the agricultural revolution and maximize your water efficiency today.
					</p>
					<Link
						to='/signup'
						className='px-8 py-3 text-lg font-semibold text-green-700 transition duration-300 bg-white rounded-full hover:bg-green-100'>
						Get Started
					</Link>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	)
}

const FeatureCard = ({ icon, title, description }) => {
	return (
		<div className='p-6 text-center bg-white rounded-lg shadow-md'>
			{icon}
			<h4 className='mb-2 text-xl font-semibold'>{title}</h4>
			<p className='text-gray-600'>{description}</p>
		</div>
	)
}

export default Main
