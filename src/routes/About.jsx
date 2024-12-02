import NavBar from '../components/NavBar'

const AboutUs = () => {
	return (
		<div className='min-h-screen bg-green-50'>
			{/* Header */}
			<NavBar />

			{/* About Content */}
			<main className='container mx-auto py-8'>
				<h2 className='text-3xl font-bold mb-6'>About Agro Healthy AI</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					{/* Company Overview */}
					<div className='bg-white p-6 rounded-lg shadow-md'>
						<h3 className='text-xl font-semibold mb-4'>Our Mission</h3>
						<p className='mb-4'>
							At Agro Healthy AI, we're on a mission to revolutionize agriculture through
							cutting-edge artificial intelligence. Our goal is to empower farmers with
							the tools they need to optimize water usage, prevent droughts, and increase
							crop yields while promoting sustainable farming practices.
						</p>
						<p>
							Founded in 2020 by a team of agricultural experts and AI specialists, we've
							been at the forefront of developing innovative solutions to address the most
							pressing challenges in modern farming.
						</p>
					</div>

					{/* Team Section */}
					<div className='bg-white p-6 rounded-lg shadow-md'>
						<h3 className='text-xl font-semibold mb-4'>Our Team</h3>
						<div className='grid grid-cols-2 gap-4'>
							{[
								{ name: 'Dr. Jane Smith', role: 'CEO & AI Specialist' },
								{ name: 'John Doe', role: 'Chief Agronomist' },
								{ name: 'Emily Chen', role: 'Lead Software Engineer' },
								{ name: 'Michael Johnson', role: 'Data Scientist' },
							].map((member, index) => (
								<div
									key={index}
									className='text-center'>
									<div className='w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2'></div>
									<h4 className='font-semibold'>{member.name}</h4>
									<p className='text-sm text-gray-600'>{member.role}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Technology Section */}
				<div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
					<h3 className='text-xl font-semibold mb-4'>Our Technology</h3>
					<p className='mb-4'>
						Agro Healthy AI leverages state-of-the-art machine learning algorithms and
						satellite imagery to provide accurate predictions and recommendations for
						water management. Our system analyzes various factors including:
					</p>
					<ul className='list-disc list-inside mb-4'>
						<li>Soil moisture levels</li>
						<li>Weather patterns</li>
						<li>Crop types and growth stages</li>
						<li>Historical data and trends</li>
					</ul>
					<p>
						By combining these data points, we offer tailored solutions that help farmers
						make informed decisions about irrigation, crop selection, and resource
						allocation.
					</p>
				</div>
			</main>

			{/* Footer */}
			<footer className='bg-green-800 text-white py-8 mt-8'>
				<div className='container mx-auto text-center'>
					<p>&copy; 2024 Agro Healthy AI. All rights reserved.</p>
				</div>
			</footer>
		</div>
	)
}

export default AboutUs
