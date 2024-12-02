import { Link } from 'react-router-dom'

const NavBar = () => {
	return (
		<header className='bg-green-600 text-white p-4'>
			<div className='container mx-auto flex justify-between items-center'>
				<h1 className='text-2xl font-bold'>Agro Healthy AI</h1>
				<nav>
					<ul className='flex space-x-4'>
						<li>
							<Link
								to='/'
								className='hover:text-green-200'>
								Home
							</Link>
						</li>
						<li>
							<Link
								to='/about'
								className='hover:text-green-200'>
								About
							</Link>
						</li>
						<li>
							<Link
								to='/contact'
								className='hover:text-green-200'>
								Contact
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}
export default NavBar
