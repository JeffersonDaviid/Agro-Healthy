const SummaryCard = ({ title, data }) => (
	<div className='relative p-4 bg-white rounded-lg drop-shadow-lg'>
		<h2 className='mb-4 text-xl font-semibold text-gray-800'>
			{title}
			<span className='mx-auto'></span>📌
		</h2>
		<ul>
			{data.map((item, index) => (
				<li
					key={index}
					className='flex justify-between my-2 text-gray-600'>
					<span>{item.label}</span>
					<span className='font-semibold'>{item.value}</span>
				</li>
			))}
		</ul>
	</div>
)

export default SummaryCard
