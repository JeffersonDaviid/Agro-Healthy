import { useEffect, useRef } from 'react'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Polygon from 'ol/geom/Polygon'
import 'ol/ol.css'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'

export default function HeatMap({ data, polygonCoordinates }) {
	const mapRef = useRef(null)
	const mapInstanceRef = useRef(null)

	// Recuperar el zoom guardado del almacenamiento local
	const savedZoom = localStorage.getItem('mapZoom') || 15 // Valor predeterminado de 15 si no está guardado

	useEffect(() => {
		// Inicializa el mapa solo una vez
		if (!mapInstanceRef.current) {
			const map = new Map({
				target: mapRef.current,
				layers: [
					new TileLayer({
						source: new XYZ({
							url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVmZmZlcnNvbmRhdmlpZCIsImEiOiJjbTRteDZyMWQwMjNnMnJvc2g2a3VvN2xpIn0.1fF5s8zJw86zzxYaOLS1iA',
							tileSize: 512,
							maxZoom: 18,
						}),
					}),
				],
				view: new View({
					center: fromLonLat([-79.557208, -1.430158]), // Coordenadas de ejemplo
					zoom: parseInt(savedZoom), // Usar el zoom guardado
				}),
			})
			mapInstanceRef.current = map
		}

		// Crear características para el heatmap
		const features = []
		if (data) {
			data.forEach((point) => {
				if (point.lng && point.lat && point.moisture) {
					const feature = new Feature({
						geometry: new Point(fromLonLat([point.lng, point.lat])), // Convierte a lon-lat
						weight: point.moisture, // Peso del punto
					})
					features.push(feature)
				}
			})
		}

		const vectorSource = new VectorSource({
			features: features,
		})

		// Crear el polígono con las coordenadas
		const polygonFeature = new Feature({
			geometry: new Polygon([
				polygonCoordinates.map((coord) => fromLonLat([coord.lng, coord.lat])),
			]),
		})

		const polygonSource = new VectorSource({
			features: [polygonFeature],
		})

		// Estilo para el polígono
		const polygonLayer = new VectorLayer({
			source: polygonSource,
			style: new Style({
				stroke: new Stroke({
					color: '#FFFFFF', // Color blanco
					width: 3, // Asegúrate de que el ancho sea visible
				}),
				fill: new Fill({
					color: 'rgba(255, 255, 255, 0.25)', // Color de relleno semi-transparente
				}),
			}),
		})

		// Agregar la capa del polígono al mapa
		mapInstanceRef.current.addLayer(polygonLayer)

		// Crear la capa de heatmap
		const heatmapLayer = new Heatmap({
			source: vectorSource,
			blur: 5, // Reducir el blur hace que el color sea más intenso
			radius: 15, // Aumenta el radio para cubrir más área
			weight: function (feature) {
				const weight = feature.get('weight')
				// Aumentar los valores del peso para intensificar el color
				return Math.min(weight * 1.8, 1) // Duplicamos el peso pero limitamos a un máximo de 1
			},
			gradient: [
				'rgba(128, 0, 0, 0.75)', // Rojo transparente - mas seco
				'rgba(255, 0, 0, 1)', // Rojo puro
				'rgba(255, 165, 0, 1)', // naranja
				'rgba(255, 255, 0, 1)', // Amarillo
				'rgba(0, 0, 165, 1)', // azul obscuro
				'rgba(0, 0, 255, 1)', // azul brillante - mas húmedo
			],
		})

		// Eliminar cualquier capa existente antes de agregar una nueva
		mapInstanceRef.current.getLayers().forEach((layer) => {
			if (layer instanceof Heatmap) {
				mapInstanceRef.current.removeLayer(layer)
			}
		})

		// Agregar la capa de heatmap
		mapInstanceRef.current.addLayer(heatmapLayer)

		// Guardar el zoom actual cuando cambia
		mapInstanceRef.current.getView().on('change:resolution', () => {
			const zoom = mapInstanceRef.current.getView().getZoom()
			localStorage.setItem('mapZoom', zoom) // Guardar el zoom en localStorage
		})
	}, [data, polygonCoordinates]) // Dependencias para actualizaciones

	useEffect(() => {
		// Manejar el redimensionamiento de la ventana para actualizar el tamaño del mapa
		const updateMapSize = () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.updateSize()
			}
		}

		window.addEventListener('resize', updateMapSize)
		updateMapSize() // Actualización inicial de tamaño

		return () => window.removeEventListener('resize', updateMapSize)
	}, [])

	return (
		<div
			ref={mapRef}
			style={{ width: '100%', height: '100%' }}
		/>
	)
}
