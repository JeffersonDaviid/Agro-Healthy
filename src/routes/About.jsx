import Footer from '../components/Footer'
import NavBar from '../components/NavBar'

const AboutUs = () => {
	return (
		<div className='min-h-screen bg-green-50'>
			{/* Header */}
			<NavBar />

			{/* About Content */}
			<main className='container py-8 mx-auto'>
				<h2 className='mb-6 text-3xl font-bold'>About Agro Healthy AI</h2>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
					{/* Company Overview */}
					<div className='p-6 bg-white rounded-lg shadow-md'>
						<h3 className='mb-4 text-xl font-semibold'>Our Mission</h3>
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
					<div className='p-6 bg-white rounded-lg shadow-md'>
						<h3 className='mb-4 text-xl font-semibold'>Our Team</h3>
						<div className='grid grid-cols-2 gap-4'>
							{[
								{
									name: 'Jefferson Chileno',
									role: 'CEO & AI Specialist',
									urlImg: './assets/team/jc.jpg',
								},
								{
									name: 'Jonathan Luzuriaga',
									role: 'Chief Agronomist',
									urlImg: './assets/team/jl.jpg',
								},
								{
									name: 'Ronny Cartagena',
									role: 'Lead Software Engineer',
									urlImg: './assets/team/rnn.jpg',
								},
								{
									name: 'Ricardo Villarreal',
									role: 'Data Scientist',
									urlImg: './assets/team/r.jpg',
								},
							].map((member, index) => (
								<div
									key={index}
									className='text-center'>
									<img
										className='w-24 h-24 mx-auto mb-2 bg-gray-300 rounded-full'
										src={member.urlImg}
									/>
									<h4 className='font-semibold'>{member.name}</h4>
									<p className='text-sm text-gray-600'>{member.role}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Technology Section */}
				<div className='p-6 mt-8 bg-white rounded-lg shadow-md'>
					<h3 className='mb-4 text-xl font-semibold'>Our Technology</h3>
					<p className='mb-4'>
						Agro Healthy AI leverages state-of-the-art machine learning algorithms and
						satellite imagery to provide accurate predictions and recommendations for
						water management. Our system analyzes various factors including:
					</p>
					<ul className='mb-4 list-disc list-inside'>
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
			<Footer />
		</div>
	)
}

export default AboutUs
