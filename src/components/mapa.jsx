import React, { useEffect } from 'react'
import { MapContainer, Polygon, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet.heat'

// Componente para Heatmap
const HeatmapLayer = ({ data }) => {
	const map = useMap() // Acceder al mapa gestionado por react-leaflet

	useEffect(() => {
		// Agregar heatmap solo si hay datos
		if (data && data.length > 0) {
			const heatData = data.map(({ lat, lng, intensity }) => [lat, lng, intensity])

			const heatLayer = L.heatLayer(heatData, {
				radius: 25, // Radio de los puntos
				blur: 15, // Difuminado
				maxZoom: 17,
			})

			heatLayer.addTo(map)
		}
	}, [data, map]) // Reaccionar al cambio de datos

	return null
}

const MapaGgg = ({ data, bounds, corners }) => {
	return (
		<MapContainer
			style={{ height: '100vh', width: '100%' }}
			center={bounds?.center || [0, 0]} // Asegura que el mapa tiene un centro
			zoom={bounds?.zoom || 10} // Asegura que el mapa tiene un nivel de zoom
			scrollWheelZoom={true}>
			{/* Capa Base (Vista Satelital de Mapbox) */}
			<TileLayer
				url='https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVmZmZlcnNvbmRhdmlpZCIsImEiOiJjbTRteDZyMWQwMjNnMnJvc2g2a3VvN2xpIn0.1fF5s8zJw86zzxYaOLS1iA'
				attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
				maxZoom={18}
			/>
			{/* Capa Heatmap */}
			<HeatmapLayer data={data} />
			<Polygon
				positions={corners} // Array de coordenadas para los vértices del polígono
				pathOptions={{
					color: 'white',
					weight: 2,
					opacity: 0.8,
					fillColor: 'white',
					fillOpacity: 0.1,
				}}
			/>
		</MapContainer>
	)
}

export default MapaGgg
