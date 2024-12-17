import axios from 'axios'

export const getSoilMoisture = (areaCorners, date) => {
	const fetchMoistureData = async () => {
		const data_calculate = generateCoordinatesInside(areaCorners, date)
		const data = {
			data: data_calculate,
		}
		const response = await axios.post('http://localhost:8000/predict', data)
		localStorage.setItem('moistureData', JSON.stringify(response.data))
		return response.data
	}

	if (localStorage.getItem('moistureData')) {
		console.log(JSON.parse(localStorage.getItem('moistureData')))
		return JSON.parse(localStorage.getItem('moistureData'))
	} else {
		return fetchMoistureData()
	}
}

/* Función para generar datos de humedad en el suelo */
export const generateCoordinatesInside = (areaCorners, date) => {
	// Extraer año, mes y día de la fecha
	const year = date.getFullYear()
	const month = date.getMonth() + 1 // Mes ajustado a base 1
	const day = date.getDate()

	const moistureData = []
	const stepInMeters = 25 // Espacio deseado entre puntos (5 metros)

	// Aproximar grados a partir de metros (1 grado ≈ 111,111 metros en el ecuador)
	const metersToDegrees = (meters, latitude) => {
		const latDegree = meters / 111111 // 1 grado ≈ 111 km
		const lngDegree = meters / (111111 * Math.cos(latitude * (Math.PI / 180)))
		return { latStep: latDegree, lngStep: lngDegree }
	}

	const isInsidePolygon = (point, corners) => {
		const x = point.lng,
			y = point.lat
		let inside = false
		for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
			const xi = corners[i].lng,
				yi = corners[i].lat
			const xj = corners[j].lng,
				yj = corners[j].lat
			const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
			if (intersect) inside = !inside
		}
		return inside
	}

	// Calcular los límites del área
	const minLat = Math.min(...areaCorners.map((c) => c.lat))
	const maxLat = Math.max(...areaCorners.map((c) => c.lat))
	const minLng = Math.min(...areaCorners.map((c) => c.lng))
	const maxLng = Math.max(...areaCorners.map((c) => c.lng))

	// Calcular el paso en grados (dependiente de la latitud media del área)
	const latitudeCenter = (minLat + maxLat) / 2
	const { latStep, lngStep } = metersToDegrees(stepInMeters, latitudeCenter)

	// Generar puntos dentro del área
	for (let lat = minLat; lat <= maxLat; lat += latStep) {
		for (let lng = minLng; lng <= maxLng; lng += lngStep) {
			if (isInsidePolygon({ lat, lng }, areaCorners)) {
				moistureData.push({
					year: year,
					month: month,
					day: day,
					Latitude: lat,
					Longitude: lng,
					moistureData: Math.random(),
				})
			}
		}
	}

	return moistureData
}
