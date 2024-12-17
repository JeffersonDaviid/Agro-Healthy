import { useState } from 'react'
import NavBar from '../components/NavBar'

const Contact = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	})

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// Here you would typically send the form data to your backend
		console.log('Form submitted:', formData)
		alert('Thank you for your message. We will get back to you soon!')
		setFormData({ name: '', email: '', message: '' })
	}

	return (
		<div className='min-h-screen bg-green-50'>
			{/* Header */}
			<NavBar />

			{/* Contact Content */}
			<main className='container py-8 mx-auto'>
				<h2 className='mb-6 text-3xl font-bold'>Contact Us</h2>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
					{/* Contact Form */}
					<div className='p-6 bg-white rounded-lg shadow-md'>
						<h3 className='mb-4 text-xl font-semibold'>Send us a message</h3>
						<form onSubmit={handleSubmit}>
							<div className='mb-4'>
								<label
									htmlFor='name'
									className='block mb-2 text-sm font-medium text-gray-700'>
									Name
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={formData.name}
									onChange={handleChange}
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500'
								/>
							</div>
							<div className='mb-4'>
								<label
									htmlFor='email'
									className='block mb-2 text-sm font-medium text-gray-700'>
									Email
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500'
								/>
							</div>
							<div className='mb-4'>
								<label
									htmlFor='message'
									className='block mb-2 text-sm font-medium text-gray-700'>
									Message
								</label>
								<textarea
									id='message'
									name='message'
									value={formData.message}
									onChange={handleChange}
									required
									rows='4'
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500'></textarea>
							</div>
							<button
								type='submit'
								className='px-4 py-2 text-white transition duration-300 bg-green-600 rounded-md hover:bg-green-700'>
								Send Message
							</button>
						</form>
					</div>

					{/* Contact Information */}
					<div className='p-6 bg-white rounded-lg shadow-md'>
						<h3 className='mb-4 text-xl font-semibold'>Get in touch</h3>
						<div className='space-y-4'>
							<p>
								<strong>Address:</strong>
								<br />
								123 Agro Healthy Street
								<br />
								Farmville, AG 12345
							</p>
							<p>
								<strong>Phone:</strong>
								<br />
								+593 98 765 4321
							</p>
							<p>
								<strong>Email:</strong>
								<br />
								info@agrohealthyai.com
							</p>
							<p>
								<strong>Business Hours:</strong>
								<br />
								Monday - Friday: 9am - 5pm
								<br />
								Saturday: 10am - 2pm
								<br />
								Sunday: Closed
							</p>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className='py-8 mt-8 text-white bg-green-800'>
				<div className='container mx-auto text-center'>
					<p>&copy; 2024 Agro Healthy AI. All rights reserved.</p>
				</div>
			</footer>
		</div>
	)
}

export default Contact
