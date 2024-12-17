import React, { useState, useCallback, useMemo } from 'react'
import { GoogleMap, HeatmapLayer, Polygon } from '@react-google-maps/api'

export default function GoogleMapsHeatmap({ data, areaCorners }) {
	const [map, setMap] = useState(null)
	const [mapError, setMapError] = useState(null)

	const center = useMemo(() => {
		const lats = areaCorners.map((point) => point.lat)
		const lngs = areaCorners.map((point) => point.lng)
		return {
			lat: (Math.min(...lats) + Math.max(...lats)) / 2,
			lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
		}
	}, [areaCorners])

	const onLoad = useCallback(
		(map) => {
			setMap(map)
			const bounds = new google.maps.LatLngBounds()
			areaCorners.forEach((corner) =>
				bounds.extend(new google.maps.LatLng(corner.lat, corner.lng))
			)
			map.fitBounds(bounds)
		},
		[areaCorners]
	)

	const onUnmount = useCallback(() => {
		setMap(null)
	}, [])

	if (mapError) {
		return (
			<div className='flex items-center justify-center w-full h-full text-red-500 bg-red-100'>
				Error loading Google Maps. Please try again later.
			</div>
		)
	}

	return (
		<GoogleMap
			mapContainerStyle={{ width: '100%', height: '100%' }}
			center={center}
			zoom={17}
			onLoad={onLoad}
			onUnmount={onUnmount}
			options={{
				mapTypeId: 'satellite',
				disableDefaultUI: true,
				zoomControl: true,
			}}>
			<HeatmapLayer
				data={data.map((point) => ({
					location: new google.maps.LatLng(point.lat, point.lng),
					weight: point.moisture,
				}))}
				options={{
					radius: 20,
					opacity: 0.5,
					gradient: [
						'rgba(255, 0, 0, 0)',
						'rgba(255, 255, 0, 1)',
						'rgba(0, 255, 255, 1)',
						'rgba(0, 0, 255, 1)',
					],
				}}
			/>
			<Polygon
				paths={areaCorners}
				options={{
					strokeColor: '#FFFFFF',
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#FFFFFF',
					fillOpacity: 0.1,
				}}
			/>
		</GoogleMap>
	)
}
