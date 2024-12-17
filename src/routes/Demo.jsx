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

const Demo = () => {
	const [corners, setCorners] = useState([null, null, null, null]) // Coordenadas de los 4 puntos
	const [map, setMap] = useState(null)
	const [location, setLocation] = useState('') // Lugar a buscar
	const [errorMessage, setErrorMessage] = useState('')
	const [polygonLayer, setPolygonLayer] = useState(null) // Para manejar la capa del polígono

	// Cambiar a vista satelital con Mapbox
	const mapboxAccessToken =
		'pk.eyJ1IjoiamVmZmZlcnNvbmRhdmlpZCIsImEiOiJjbTRteDZyMWQwMjNnMnJvc2g2a3VvN2xpIn0.1fF5s8zJw86zzxYaOLS1iA'

	// Recuperar configuraciones desde localStorage
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

		// Crear la capa del polígono
		const vectorLayer = new VectorLayer({
			source: vectorSource,
			style: new Style({
				fill: new Fill({
					color: 'rgba(0, 255, 0, 0.3)', // Color verde con opacidad 0.3
				}),
				stroke: new Stroke({
					color: '#ff0000',
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
				}), // Vista satelital en el fondo
				// new TileLayer({
				// 	source: new XYZ({
				// 		url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`,
				// 		attributions: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
				// 	}),
				// 	zIndex: 1, // Establecer el zIndex para que los nombres estén por encima
				// }), // Nombres de lugares sobre el satélite
				vectorLayer, // Añadir la capa de polígonos
			],
			view: new View({
				center: fromLonLat(savedCenter),
				zoom: parseInt(savedZoom),
			}),
		})

		setPolygonLayer(vectorLayer) // Guardar la referencia de la capa del polígono

		initialMap.on('click', (event) => {
			let clickCount = parseInt(localStorage.getItem('clickCount')) || 0

			if (clickCount < 4) {
				const coordinate = toLonLat(initialMap.getCoordinateFromPixel(event.pixel)) // Convierte a lat/lon
				const lonLat = coordinate.map((c) => c.toFixed(6)) // Limitar a 6 decimales

				// Actualizamos las coordenadas en localStorage
				const updatedCorners = JSON.parse(localStorage.getItem('corners')) || [
					null,
					null,
					null,
					null,
				]
				updatedCorners[clickCount] = {
					lon: parseFloat(lonLat[0]),
					lat: parseFloat(lonLat[1]),
				}
				localStorage.setItem('corners', JSON.stringify(updatedCorners))

				// Actualizar clickCount y guardarlo en localStorage
				localStorage.setItem('clickCount', (clickCount + 1).toString())

				// Recargar las coordenadas del storage
				setCorners(updatedCorners)

				// Si se tienen 4 puntos, dibujar el polígono
				if (updatedCorners.filter((corner) => corner !== null).length === 4) {
					const polygonCoordinates = updatedCorners.map((corner) => [
						corner.lon,
						corner.lat,
					])
					const polygon = new Polygon([polygonCoordinates])
					const feature = new Feature(polygon)
					vectorSource.clear() // Limpiar el polígono anterior
					vectorSource.addFeature(feature) // Añadir el nuevo polígono

					// Calcular el centro de los cuatro puntos
					const centerLon =
						updatedCorners.reduce((acc, corner) => acc + corner.lon, 0) / 4
					const centerLat =
						updatedCorners.reduce((acc, corner) => acc + corner.lat, 0) / 4

					// Centrar el mapa en la posición intermedia
					initialMap.getView().setCenter(fromLonLat([centerLon, centerLat]))
				}
			}
		})

		setMap(initialMap)

		return () => initialMap.setTarget(null)
	}, []) // Solo se ejecuta una vez cuando el componente se monta

	// Guardar zoom y centro en localStorage
	useEffect(() => {
		if (map) {
			const view = map.getView()
			const center = toLonLat(view.getCenter())
			const zoom = view.getZoom()

			localStorage.setItem('zoom', zoom)
			localStorage.setItem('center', JSON.stringify(center))
		}
	}, [map]) // Este useEffect solo se dispara cuando se monta el mapa

	// Resetear los valores en el localStorage y el estado
	const resetCoordinates = () => {
		setCorners([null, null, null, null])
		localStorage.removeItem('corners')
		localStorage.removeItem('clickCount')
		localStorage.removeItem('zoom')
		localStorage.removeItem('center')
		setLocation('')
		setErrorMessage('')
		if (map) {
			const view = map.getView()
			view.setCenter(fromLonLat([-79.5074, -0.1276])) // Centrar en la ubicación inicial
			view.setZoom(10) // Establecer el zoom por defecto
		}

		// Limpiar la capa de polígonos
		if (polygonLayer) {
			polygonLayer.getSource().clear()
		}
	}

	// Manejar la búsqueda de un lugar por nombre
	const handleLocationChange = (e) => {
		setLocation(e.target.value)
		setErrorMessage('')
	}

	// Realizar la geocodificación del nombre de lugar
	const searchLocation = async () => {
		if (location.trim() === '') {
			return
		}

		try {
			const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
				params: {
					q: location,
					format: 'json',
					limit: 1, // Limitar a un solo resultado
				},
			})

			if (response.data.length > 0) {
				const { lon, lat } = response.data[0]
				const coordinates = [parseFloat(lon), parseFloat(lat)]

				// Centrar el mapa en las nuevas coordenadas
				map.getView().setCenter(fromLonLat(coordinates))
				map.getView().setZoom(12)

				// Guardar las nuevas coordenadas y zoom
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
		<div className='min-h-screen p-6 bg-gray-100'>
			<h1 className='mb-6 text-2xl font-bold text-center'>Soil Humidity Predictor</h1>

			{/* Campo para ingresar nombre del lugar */}
			<div className='mb-4'>
				<input
					type='text'
					value={location}
					onChange={handleLocationChange}
					placeholder='Ingresa el nombre de un lugar'
					className='px-4 py-2 mr-2 border rounded-md'
				/>
				<button
					onClick={searchLocation}
					className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'>
					Buscar
				</button>
			</div>

			{errorMessage && <p className='text-red-500'>{errorMessage}</p>}

			{/* Mostrar las coordenadas de los puntos */}
			<div>
				<ul>
					{corners.map((corner, index) =>
						corner ? (
							<li
								key={index}
								className='p-2 rounded-md'>
								Punto {index + 1}: Lat: {corner.lat}, Lon: {corner.lon}
							</li>
						) : (
							<li key={index}>Punto {index + 1}: No seleccionado</li>
						)
					)}
				</ul>
			</div>

			<div
				id='map'
				className='h-[500px] w-full'></div>

			<div className='mt-4'>
				<button
					onClick={resetCoordinates}
					className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'>
					Resetear Coordenadas
				</button>
			</div>
		</div>
	)
}

export default Demo

// import React, { useState, useRef } from 'react'
// import GoogleMapReact from 'google-map-react' // Asegúrate de instalar google-map-react

// const Demo = () => {
// 	const [corners, setCorners] = useState([null, null, null, null])
// 	const [center, setCenter] = useState(null)
// 	const [initialLocation, setInitialLocation] = useState('')
// 	const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
// 	const [zoom, setZoom] = useState(10)

// 	const handleApiLoaded = (map, maps) => {
// 		if (initialLocation) {
// 			const geocoder = new maps.Geocoder()
// 			geocoder.geocode({ address: initialLocation }, (results, status) => {
// 				if (status === 'OK' && results[0]) {
// 					const { lat, lng } = results[0].geometry.location
// 					setMapCenter({ lat: lat(), lng: lng() })
// 				}
// 			})
// 		}
// 	}

// 	const handleMapClick = ({ lat, lng }) => {
// 		const updatedCorners = [...corners]
// 		const emptyIndex = updatedCorners.findIndex((corner) => corner === null)

// 		if (emptyIndex !== -1) {
// 			updatedCorners[emptyIndex] = { lat, lng }
// 			setCorners(updatedCorners)
// 			if (updatedCorners.every((corner) => corner !== null)) {
// 				const avgLat =
// 					(updatedCorners[0].lat +
// 						updatedCorners[1].lat +
// 						updatedCorners[2].lat +
// 						updatedCorners[3].lat) /
// 					4
// 				const avgLng =
// 					(updatedCorners[0].lng +
// 						updatedCorners[1].lng +
// 						updatedCorners[2].lng +
// 						updatedCorners[3].lng) /
// 					4
// 				setCenter({ lat: avgLat, lng: avgLng })
// 			}
// 		}
// 	}

// 	const resetCoordinates = () => {
// 		setCorners([null, null, null, null])
// 		setCenter(null)
// 	}

// 	return (
// 		<div className='min-h-screen p-6 bg-gray-100'>
// 			<h1 className='mb-6 text-2xl font-bold text-center'>Soil Humidity Predictor</h1>
// 			<div className='mb-4'>
// 				<label className='block text-lg font-medium text-gray-700'>
// 					Reference Location:
// 				</label>
// 				<input
// 					type='text'
// 					value={initialLocation}
// 					onChange={(e) => setInitialLocation(e.target.value)}
// 					className='block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
// 					placeholder='Enter a location (e.g., city, address)'
// 				/>
// 			</div>
// 			<div className='mb-4 h-96'>
// 				<GoogleMapReact
// 					bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
// 					defaultCenter={mapCenter}
// 					center={mapCenter}
// 					defaultZoom={zoom}
// 					zoom={zoom}
// 					onClick={handleMapClick}
// 					yesIWantToUseGoogleMapApiInternals
// 					onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
// 				/>
// 			</div>
// 			<div className='grid grid-cols-2 gap-4 mb-4'>
// 				{corners.map((corner, index) => (
// 					<div
// 						key={index}
// 						className='p-4 bg-white rounded-lg shadow-md'>
// 						<h2 className='text-sm font-medium'>Corner {index + 1}</h2>
// 						{corner ? (
// 							<p>
// 								Lat: {corner.lat.toFixed(6)}, Lng: {corner.lng.toFixed(6)}
// 							</p>
// 						) : (
// 							<p className='text-gray-400'>Click on the map to set this corner</p>
// 						)}
// 					</div>
// 				))}
// 			</div>
// 			{center && (
// 				<div className='p-4 text-center bg-green-100 rounded-lg shadow-md'>
// 					<h2 className='text-lg font-bold'>Area Center</h2>
// 					<p>
// 						Lat: {center.lat.toFixed(6)}, Lng: {center.lng.toFixed(6)}
// 					</p>
// 				</div>
// 			)}
// 			<button
// 				onClick={resetCoordinates}
// 				className='px-4 py-2 mt-4 text-white bg-red-500 rounded-md hover:bg-red-600'>
// 				Reset Coordinates
// 			</button>
// 		</div>
// 	)
// }

// export default Demo
