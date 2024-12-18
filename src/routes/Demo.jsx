import React, { useState, useEffect } from 'react'
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat, toLonLat } from 'ol/proj'
import XYZ from 'ol/source/XYZ'
import axios from 'axios'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Polygon } from 'ol/geom'
import Feature from 'ol/Feature'
import { Style, Fill, Stroke } from 'ol/style'
import ViewMapIA from '../components/ViewMapIA'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import { getSoilMoisture } from '../services/SoilMoisture'

const Demo = () => {
	const [corners, setCorners] = useState([null, null, null, null])
	const [map, setMap] = useState(null)
	const [location, setLocation] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [polygonLayer, setPolygonLayer] = useState(null)
	const [isSelectedCorners, setIsSelectedCorners] = useState(false)
	const [isPredicting, setIsPredicting] = useState(false)
	const [rawData, setRawData] = useState()

	const mapboxAccessToken =
		'pk.eyJ1IjoiamVmZmZlcnNvbmRhdmlpZCIsImEiOiJjbTRteDZyMWQwMjNnMnJvc2g2a3VvN2xpIn0.1fF5s8zJw86zzxYaOLS1iA'

	useEffect(() => {
		const savedCorners = JSON.parse(localStorage.getItem('corners')) || [
			null,
			null,
			null,
			null,
		]
		const savedZoom = localStorage.getItem('zoom') || 10
		const savedCenter = JSON.parse(localStorage.getItem('center')) || [-79.5074, -0.1276]

		setCorners(savedCorners)

		const vectorSource = new VectorSource()
		const vectorLayer = new VectorLayer({
			source: vectorSource,
			style: new Style({
				fill: new Fill({
					color: 'rgba(67, 170, 139, 0.5)',
				}),
				stroke: new Stroke({
					color: '#4391DA',
					width: 2,
				}),
			}),
		})

		const initialMap = new Map({
			target: 'map',
			layers: [
				new TileLayer({
					source: new XYZ({
						url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`,
						attributions: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
					}),
				}),
				vectorLayer,
			],
			view: new View({
				center: fromLonLat(savedCenter),
				zoom: parseInt(savedZoom),
			}),
		})

		setPolygonLayer(vectorLayer)

		initialMap.on('click', (event) => {
			let clickCount = parseInt(localStorage.getItem('clickCount')) || 0

			if (clickCount < 4) {
				const coordinate = toLonLat(initialMap.getCoordinateFromPixel(event.pixel))
				const lonLat = coordinate.map((c) => c.toFixed(6))

				const updatedCorners = JSON.parse(localStorage.getItem('corners')) || [
					null,
					null,
					null,
					null,
				]
				updatedCorners[clickCount] = {
					lng: parseFloat(lonLat[0]),
					lat: parseFloat(lonLat[1]),
				}
				localStorage.setItem('corners', JSON.stringify(updatedCorners))

				localStorage.setItem('clickCount', (clickCount + 1).toString())
				setCorners(updatedCorners)

				if (updatedCorners.filter((corner) => corner !== null).length === 4) {
					setIsSelectedCorners(true)
					const polygonCoordinates = updatedCorners.map((corner) => [
						corner.lon,
						corner.lat,
					])
					const polygon = new Polygon([polygonCoordinates])
					const feature = new Feature(polygon)
					vectorSource.clear()
					vectorSource.addFeature(feature)

					const centerLon =
						updatedCorners.reduce((acc, corner) => acc + corner.lon, 0) / 4
					const centerLat =
						updatedCorners.reduce((acc, corner) => acc + corner.lat, 0) / 4

					initialMap.getView().setCenter(fromLonLat([centerLon, centerLat]))
				}
			}
		})

		setMap(initialMap)

		return () => initialMap.setTarget(null)
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			if (isSelectedCorners) {
				try {
					setIsPredicting(true) // Establecer el estado de predicción a true (cargando)
					const data = await getSoilMoisture(corners, new Date()) // Obtener los datos
					setRawData(data) // Establecer los datos de humedad del suelo
				} catch (error) {
					console.error('Error predicting soil moisture:', error)
				} finally {
					setIsPredicting(false)
				}
			}
		}

		fetchData() // Llamar la función fetchData
	}, [isSelectedCorners, corners]) // Dependencias

	useEffect(() => {
		if (map) {
			const view = map.getView()
			const center = toLonLat(view.getCenter())
			const zoom = view.getZoom()

			localStorage.setItem('zoom', zoom)
			localStorage.setItem('center', JSON.stringify(center))
		}
	}, [map])

	const resetCoordinates = () => {
		setCorners([null, null, null, null])
		localStorage.removeItem('corners')
		localStorage.removeItem('clickCount')
		localStorage.removeItem('moistureData')
		setLocation('')
		setErrorMessage('')
		if (map) {
			const view = map.getView()
			view.setCenter(fromLonLat([-79.5074, -0.1276]))
			view.setZoom(10)
		}

		if (polygonLayer) {
			polygonLayer.getSource().clear()
		}
	}

	const handleLocationChange = (e) => {
		setLocation(e.target.value)
		setErrorMessage('')
	}

	const searchLocation = async () => {
		if (location.trim() === '') {
			return
		}

		try {
			const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
				params: {
					q: location,
					format: 'json',
					limit: 1,
				},
			})

			if (response.data.length > 0) {
				const { lon, lat } = response.data[0]
				const coordinates = [parseFloat(lon), parseFloat(lat)]

				map.getView().setCenter(fromLonLat(coordinates))
				map.getView().setZoom(12)

				localStorage.setItem('zoom', map.getView().getZoom())
				localStorage.setItem('center', JSON.stringify(coordinates))
				setErrorMessage('')
			} else {
				setErrorMessage('Lugar no encontrado. Intenta con otro nombre.')
			}
		} catch (error) {
			setErrorMessage('Hubo un error al buscar la ubicación.')
		}
	}

	return (
		<>
			<NavBar />
			<div className='min-h-screen px-10 text-gray-800 bg-white '>
				<h1 className='py-6 text-4xl font-bold text-center text-green-600'>
					Soil Humidity Predictor - DEMO
				</h1>

				{isSelectedCorners ? (
					isPredicting || !rawData ? ( // Verificamos que rawData esté disponible
						<LoadingSpinner />
					) : (
						<ViewMapIA
							areaCorners={corners}
							rawData={rawData}
						/>
					)
				) : (
					<>
						<div className='flex justify-center mb-6'>
							<input
								type='text'
								value={location}
								onChange={handleLocationChange}
								placeholder='Ingresa el nombre de un lugar'
								className='px-4 py-2 mr-4 text-black bg-gray-100 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
							/>
							<button
								onClick={searchLocation}
								className='px-6 py-2 text-lg text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700'>
								Buscar
							</button>
						</div>
						{errorMessage && <p className='text-center text-red-400'>{errorMessage}</p>}

						<div className='p-2 my-4 text-center'>
							<ul className='grid grid-cols-2 gap-4'>
								{corners.map((corner, index) =>
									corner ? (
										<li
											key={index}
											className='p-0 m-0 font-semibold text-green-700 bg-gray-200 rounded-lg'>
											Punto {index + 1}: Lat: {corner.lat}, Lon: {corner.lng}
										</li>
									) : (
										<li
											key={index}
											className='p-0 m-0 font-semibold text-gray-500 '>
											Punto {index + 1}: No seleccionado
										</li>
									)
								)}
							</ul>
						</div>
						<div
							id='map'
							className='h-[550px] w-full shadow-lg rounded-md overflow-hidden'></div>
					</>
				)}

				<div className='mt-6 text-center'>
					<button
						onClick={() => {
							resetCoordinates()
							setIsSelectedCorners(false)
						}}
						className='px-6 py-2 text-lg text-white transition duration-200 bg-red-500 rounded-lg hover:bg-red-600'>
						Resetear Coordenadas
					</button>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default Demo
