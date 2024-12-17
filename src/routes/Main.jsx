import React, { useState, useEffect } from 'react'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
// import { Button } from '@/components/ui/button'
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from '@/components/ui/card'
import { LoadScript } from '@react-google-maps/api'
import { Droplets, Satellite } from 'lucide-react'
import GoogleMapsHeatmap from '../components/GoogleMapsHeatmap'
import HeatMap from '../components/Heatmap'
import MapaGgg from '../components/mapa'
import { generateCoordinatesInside, getSoilMoisture } from '../services/SoilMoisture'

const areaCorners = [
	{ lat: -1.432548, lng: -79.556902 },
	{ lat: -1.429959, lng: -79.55479 },
	{ lat: -1.428029, lng: -79.55812 },
	{ lat: -1.428724, lng: -79.559545 },
]

const tranformData = () => {
	// const data = generateCoordinatesInside(areaCorners, new Date())
	const result = []
	const data = getSoilMoisture(areaCorners, new Date())
	data.forEach((element) => {
		result.push({
			lat: element.Latitude,
			lng: element.Longitude,
			moisture: element.moistureData,
		})
	})
	return result
}

export default function Main() {
	const [moistureData, setMoistureData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [scriptLoaded, setScriptLoaded] = useState(false)
	const [scriptError, setScriptError] = useState(null)

	const updateMoistureData = async () => {
		setIsLoading(true) // Inicia el estado de carga
		const data = await tranformData()

		setMoistureData(data)
		setIsLoading(false) // Termina el estado de carga
	}

	useEffect(() => {
		updateMoistureData()
	}, [])

	const handleScriptLoad = () => setScriptLoaded(true)
	const handleScriptError = (error) => setScriptError(error)

	return (
		<>
			<NavBar />
			{/* <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="max-w-4xl mx-auto shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl font-bold text-green-800">
              <Satellite className="w-8 h-8" />
              Mapa de Humedad del Suelo
            </CardTitle>
            <CardDescription>
              Visualización satelital de la humedad del suelo en el área especificada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-[400px] w-full relative rounded-lg overflow-hidden"> */}
			<div className='block w-4/5 h-screen min-h-screen overflow-hidden rounded-lg '>
				{moistureData !== null && (
					<HeatMap
						data={moistureData}
						polygonCoordinates={areaCorners}
					/>
				)}
			</div>

			{/* <LoadScript
				googleMapsApiKey=''
				libraries={['visualization']}
				onLoad={handleScriptLoad}
				onError={handleScriptError}>
				{scriptLoaded && !scriptError && (
					<GoogleMapsHeatmap
						data={moistureData}
						areaCorners={areaCorners}
					/>
				)}
			</LoadScript> */}
			{/* {scriptError && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-red-100">
                  Error loading Google Maps. Please check your API key and network connection.
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-blue-700">Nivel de Humedad</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-4 rounded bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
                <span className="text-sm text-gray-600">Bajo - Alto</span>
              </div>
            </div>
            <Button
              onClick={updateMoistureData}
              className="w-full text-white bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Datos de Humedad'}
            </Button>
          </CardContent>
        </Card>
      </div> */}
			<Footer />
		</>
	)
}

// import React, { useState } from 'react'
// import Footer from '../components/Footer'
// import NavBar from '../components/NavBar'

// import { Button } from '@/components/ui/button'
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from '@/components/ui/card'
// import { LoadScript } from '@react-google-maps/api'
// import { Droplets, Satellite } from 'lucide-react'
// import { useEffect } from 'react'
// import GoogleMapsHeatmap from '../components/GoogleMapsHeatmap'

// // Corner coordinates of the area
// const areaCorners = [
// 	{ lat: -1.432548, lng: -79.556902 },
// 	{ lat: -1.429959, lng: -79.55479 },
// 	{ lat: -1.428029, lng: -79.55812 },
// 	{ lat: -1.428724, lng: -79.559545 },
// ]

// const generateMockMoistureData = () => {
// 	const gridSize = 20 // Number of points along each side
// 	const moistureData = []

// 	// Function to check if a point is inside the quadrilateral
// 	const isInsideQuadrilateral = (point: { lat: number; lng: number }) => {
// 		const x = point.lng
// 		const y = point.lat
// 		let inside = false
// 		for (let i = 0, j = areaCorners.length - 1; i < areaCorners.length; j = i++) {
// 			const xi = areaCorners[i].lng,
// 				yi = areaCorners[i].lat
// 			const xj = areaCorners[j].lng,
// 				yj = areaCorners[j].lat
// 			const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
// 			if (intersect) inside = !inside
// 		}
// 		return inside
// 	}

// 	// Calculate bounding box
// 	const minLat = Math.min(...areaCorners.map((c) => c.lat))
// 	const maxLat = Math.max(...areaCorners.map((c) => c.lat))
// 	const minLng = Math.min(...areaCorners.map((c) => c.lng))
// 	const maxLng = Math.max(...areaCorners.map((c) => c.lng))

// 	// Generate points
// 	for (let i = 0; i <= gridSize; i++) {
// 		for (let j = 0; j <= gridSize; j++) {
// 			const lat = minLat + (maxLat - minLat) * (i / gridSize)
// 			const lng = minLng + (maxLng - minLng) * (j / gridSize)

// 			if (isInsideQuadrilateral({ lat, lng })) {
// 				// Generate a more realistic moisture pattern
// 				const centerLat = (minLat + maxLat) / 2
// 				const centerLng = (minLng + maxLng) / 2
// 				const distanceFromCenter = Math.sqrt(
// 					Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)
// 				)
// 				const maxDistance =
// 					Math.sqrt(Math.pow(maxLat - minLat, 2) + Math.pow(maxLng - minLng, 2)) / 2

// 				// Create a moisture gradient with some randomness
// 				const baseMoisture = 50 + (1 - distanceFromCenter / maxDistance) * 50
// 				const moisture = Math.min(
// 					100,
// 					Math.max(0, baseMoisture + (Math.random() - 0.5) * 20)
// 				)

// 				moistureData.push({ lat, lng, moisture })
// 			}
// 		}
// 	}

// 	return moistureData
// }

// export default function Main() {
// 	const [moistureData, setMoistureData] = useState(generateMockMoistureData())
// 	const [isLoading, setIsLoading] = useState(false)
// 	const [scriptLoaded, setScriptLoaded] = useState(false)
// 	const [scriptError, setScriptError] = useState(null)

// 	const updateMoistureData = () => {
// 		setIsLoading(true)
// 		// Simulate API call to update moisture data
// 		setTimeout(() => {
// 			setMoistureData(generateMockMoistureData())
// 			setIsLoading(false)
// 		}, 1500)
// 	}

// 	useEffect(() => {
// 		updateMoistureData()
// 	}, [])

// 	const handleScriptLoad = () => setScriptLoaded(true)
// 	const handleScriptError = (error: Error) => setScriptError(error)

// 	return (
// 		<>
// 			<NavBar />
// 			<div className='min-h-screen p-8 bg-gradient-to-br from-green-50 to-blue-50'>
// 				<Card className='max-w-4xl mx-auto shadow-xl bg-white/80 backdrop-blur-sm'>
// 					<CardHeader>
// 						<CardTitle className='flex items-center gap-2 text-3xl font-bold text-green-800'>
// 							<Satellite className='w-8 h-8' />
// 							Mapa de Humedad del Suelo
// 						</CardTitle>
// 						<CardDescription>
// 							Visualización satelital de la humedad del suelo en el área especificada.
// 						</CardDescription>
// 					</CardHeader>
// 					<CardContent className='space-y-6'>
// 						<div className='h-[400px] w-full relative rounded-lg overflow-hidden'>
// 							<LoadScript
// 								googleMapsApiKey={''}
// 								libraries={['visualization']}
// 								onLoad={handleScriptLoad}
// 								onError={handleScriptError}>
// 								{scriptLoaded && !scriptError && (
// 									<GoogleMapsHeatmap
// 										data={moistureData}
// 										areaCorners={areaCorners}
// 									/>
// 								)}
// 							</LoadScript>
// 							{scriptError && (
// 								<div className='absolute inset-0 flex items-center justify-center text-red-500 bg-red-100'>
// 									Error loading Google Maps. Please check your API key and network
// 									connection.
// 								</div>
// 							)}
// 						</div>
// 						<div className='flex items-center justify-between'>
// 							<div className='flex items-center gap-2'>
// 								<Droplets className='w-5 h-5 text-blue-500' />
// 								<span className='font-semibold text-blue-700'>Nivel de Humedad</span>
// 							</div>
// 							<div className='flex items-center gap-2'>
// 								<div className='w-20 h-4 rounded bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' />
// 								<span className='text-sm text-gray-600'>Bajo - Alto</span>
// 							</div>
// 						</div>
// 						<Button
// 							onClick={updateMoistureData}
// 							className='w-full text-white bg-green-600 hover:bg-green-700'
// 							disabled={isLoading}>
// 							{isLoading ? 'Actualizando...' : 'Actualizar Datos de Humedad'}
// 						</Button>
// 					</CardContent>
// 				</Card>
// 			</div>
// 			<Footer />
// 		</>
// 	)
// }
