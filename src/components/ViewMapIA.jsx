import React, { useEffect, useState } from 'react'
import HeatMap from './Heatmap'
import LoadingSpinner from './LoadingSpinner'
import SummaryCard from './SummaryCard'

const transformData = (rawData) => {
	return rawData.map((element) => {
		const irrigationPriority =
			element.VegetationRoughnessNPD / (element.moistureData + 1e-6)

		return {
			lat: element.Latitude,
			lng: element.Longitude,
			moisture: element.moistureData,
			irrigationPriority: irrigationPriority,
		}
	})
}

export default function ViewMapIA({ rawData, areaCorners }) {
	const [moistureData, setMoistureData] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [summary, setSummary] = useState({
		avgMoisture: 0,
		maxMoisture: 0,
		minMoisture: 0,
		avgIrrigationPriority: 0,
		maxIrrigationPriority: 0,
		minIrrigationPriority: 0,
	})

	const updateMoistureData = async () => {
		try {
			setIsLoading(true)
			const transformedData = transformData(rawData)

			setMoistureData(transformedData)

			const moistureValues = transformedData.map((d) => d.moisture)
			const irrigationPriorities = transformedData.map((d) => d.irrigationPriority)

			setSummary({
				avgMoisture: (
					moistureValues.reduce((a, b) => a + b, 0) / moistureValues.length
				).toFixed(2),
				maxMoisture: Math.max(...moistureValues).toFixed(2),
				minMoisture: Math.min(...moistureValues).toFixed(2),
				avgIrrigationPriority: (
					irrigationPriorities.reduce((a, b) => a + b, 0) / irrigationPriorities.length
				).toFixed(2),
				maxIrrigationPriority: Math.max(...irrigationPriorities).toFixed(2),
				minIrrigationPriority: Math.min(...irrigationPriorities).toFixed(2),
			})
		} catch (error) {
			console.error('Error fetching moisture data:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		updateMoistureData()
	}, [])

	return (
		<>
			<div className='container min-h-screen mx-auto mt-6'>
				<div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
					{/* Mapa de Calor */}
					<div className='relative lg:col-span-3'>
						<div className='rounded-lg shadow-md overflow-hidden h-full min-h-[90vh] relative'>
							{isLoading ? (
								<div className='flex items-center justify-center h-full min-h-screen '>
									<LoadingSpinner />
								</div>
							) : (
								<HeatMap
									data={moistureData}
									polygonCoordinates={areaCorners}
								/>
							)}
							{/* Leyenda en Gradiente Horizontal */}
							<div className='absolute flex flex-col items-center w-3/5 px-4 py-2 transform -translate-x-1/2 bg-white rounded-lg shadow-md bottom-4 left-1/2 bg-opacity-80'>
								<div className='w-full h-4 rounded-full bg-gradient-to-r from-red-900 via-yellow-300 to-blue-500' />
								<div className='flex justify-between w-full mt-2 text-sm text-gray-600'>
									<span>Seco</span>
									<span>Húmedo</span>
								</div>
							</div>
						</div>
					</div>

					{/* Resumen Estadístico */}
					<div className='lg:col-span-1'>
						<SummaryCard
							title='Resumen Estadístico'
							data={[
								{ label: 'Promedio de Humedad', value: `${summary.avgMoisture}%` },
								{ label: 'Máxima Humedad', value: `${summary.maxMoisture}%` },
								{ label: 'Mínima Humedad', value: `${summary.minMoisture}%` },
								{
									label: '',
									value: ``,
								},
								{
									label: '',
									value: ``,
								},
								{
									label: 'Promedio de Prioridad',
									value: `${summary.avgIrrigationPriority}`,
								},
								{ label: 'Máxima Prioridad', value: `${summary.maxIrrigationPriority}` },
								{ label: 'Mínima Prioridad', value: `${summary.minIrrigationPriority}` },
							]}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
