import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

// Función para agrupar datos en intervalos
const createHistogramData = (values, binSize) => {
	const min = Math.min(...values)
	const max = Math.max(...values)
	const bins = Array.from({ length: Math.ceil((max - min) / binSize) }, (_, i) => ({
		bin: `${min + i * binSize} - ${min + (i + 1) * binSize}`,
		count: 0,
	}))
	values.forEach((value) => {
		const index = Math.floor((value - min) / binSize)
		if (bins[index]) bins[index].count++
	})
	return bins
}

export default function Histogram({ data }) {
	const histogramData = createHistogramData(data, 5) // Tamaño de los intervalos (binSize)

	return (
		<BarChart
			width={500}
			height={300}
			data={histogramData}>
			<CartesianGrid strokeDasharray='3 3' />
			<XAxis dataKey='bin' />
			<YAxis />
			<Tooltip />
			<Bar
				dataKey='count'
				fill='#8884d8'
			/>
		</BarChart>
	)
}
