import React, { useState } from 'react'
import NavBar from '../components/NavBar'

const Demo = () => {
	const [heatmapIntensity, setHeatmapIntensity] = useState(5)
	const [selectedCrop, setSelectedCrop] = useState('corn')

	const generateHeatmapData = (intensity) => {
		const data = []
		for (let i = 0; i < 10; i++) {
			const row = []
			for (let j = 0; j < 10; j++) {
				row.push(Math.floor(Math.random() * intensity))
			}
			data.push(row)
		}
		return data
	}

	const heatmapData = generateHeatmapData(heatmapIntensity)

	const getColor = (value) => {
		const hue = ((1 - value / 10) * 120).toString(10)
		return `hsl(${hue}, 100%, 50%)`
	}

	return (
		<div className='min-h-screen bg-green-50'>
			{/* Header */}
			<NavBar />

			{/* Demo Content */}
			<main className='container mx-auto py-8'>
				<h2 className='text-3xl font-bold mb-6'>Water Risk Assessment Demo</h2>

				{/* Map and Heatmap Section */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
					{/* Map Image */}
					<div className='bg-white p-4 rounded-lg shadow-md'>
						<h3 className='text-xl font-semibold mb-4'>Satellite View</h3>
						<img
							src='https://actionheat.eu/sites/default/files/styles/scale_width_550px/public/media/mapping-hcpng.png?itok=fnjFBWXN'
							alt='Satellite view of farmland'
							className='w-full h-auto rounded'
						/>
					</div>

					{/* Heatmap */}
					<div className='bg-white p-4 rounded-lg shadow-md'>
						<h3 className='text-xl font-semibold mb-4'>Water Risk Heatmap</h3>
						<div className='grid grid-cols-10 gap-1'>
							{heatmapData.map((row, i) =>
								row.map((value, j) => (
									<div
										key={`${i}-${j}`}
										className='w-full pt-[100%] rounded'
										style={{ backgroundColor: getColor(value) }}></div>
								))
							)}
						</div>
					</div>
				</div>

				{/* Controls Section */}
				<div className='bg-white p-6 rounded-lg shadow-md'>
					<h3 className='text-xl font-semibold mb-4'>Simulation Controls</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Heatmap Intensity Slider */}
						<div>
							<label
								htmlFor='intensity'
								className='block text-sm font-medium text-gray-700 mb-2'>
								Heatmap Intensity: {heatmapIntensity}
							</label>
							<input
								type='range'
								id='intensity'
								min='1'
								max='10'
								value={heatmapIntensity}
								onChange={(e) => setHeatmapIntensity(parseInt(e.target.value))}
								className='w-full'
							/>
						</div>

						{/* Crop Selection Dropdown */}
						<div>
							<label
								htmlFor='crop'
								className='block text-sm font-medium text-gray-700 mb-2'>
								Select Crop:
							</label>
							<select
								id='crop'
								value={selectedCrop}
								onChange={(e) => setSelectedCrop(e.target.value)}
								className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'>
								<option value='corn'>Corn</option>
								<option value='wheat'>Wheat</option>
								<option value='soybean'>Soybean</option>
								<option value='rice'>Rice</option>
							</select>
						</div>
					</div>

					{/* Analysis Button */}
					<button
						className='mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300'
						onClick={() => alert('Analysis feature coming soon!')}>
						Run Analysis
					</button>
				</div>
			</main>

			{/* Footer */}
			<footer className='bg-green-800 text-white py-8 mt-8'>
				<div className='container mx-auto text-center'>
					<p>&copy; 2024 AgroTech AI. All rights reserved.</p>
				</div>
			</footer>
		</div>
	)
}

export default Demo
