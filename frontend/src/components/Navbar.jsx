import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const getRoleDisplay = (role) => {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'store_owner':
      return 'Store Owner'
    case 'normal_user':
      return 'Normal User'
    default:
      return role
  }
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Store Rating App
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-gray-700">
              <span className="font-medium">{user.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({getRoleDisplay(user.role)})
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
