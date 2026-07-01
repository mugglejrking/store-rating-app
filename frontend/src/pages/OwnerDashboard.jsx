import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SortableTable from '../components/SortableTable'
import StarRating from '../components/StarRating'
import PasswordChangeForm from '../components/PasswordChangeForm'
import { useAuth } from '../contexts/AuthContext'

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'DESC' })
  const { token } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, ratingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/owner/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/owner/ratings', { headers: { Authorization: `Bearer ${token}` } })
        ])
        const dashboardData = await dashboardRes.json()
        const ratingsData = await ratingsRes.json()
        setDashboardData(dashboardData)
        setRatings(Array.isArray(ratingsData) ? ratingsData : [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const sortedRatings = [...ratings].sort((a, b) => {
    const aVal = a[sort.sortBy]
    const bVal = b[sort.sortBy]
    if (sort.sortOrder === 'ASC') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    }
    return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
  })

  const columns = [
    { key: 'userName', label: 'User Name', sortable: true, render: (row) => row.User?.name || 'N/A' },
    { key: 'userEmail', label: 'User Email', sortable: true, render: (row) => row.User?.email || 'N/A' },
    { key: 'rating', label: 'Rating', sortable: true, render: (row) => <StarRating value={row.rating_value} readonly /> }
  ]

  const handleSort = (sortBy, sortOrder) => {
    setSort({ sortBy, sortOrder })
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Store Owner Dashboard</h1>
        
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              {dashboardData?.store ? (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{dashboardData.store.name}</h3>
                  <p className="text-gray-500 mt-2">{dashboardData.store.email}</p>
                  {dashboardData.store.address && <p className="text-gray-500">{dashboardData.store.address}</p>}
                  <div className="mt-4 flex items-center">
                    <span className="text-5xl font-bold text-yellow-600">
                      {Number(dashboardData.averageRating || 0).toFixed(1)}
                    </span>
                    <div className="ml-4">
                      <StarRating value={Math.round(Number(dashboardData.averageRating || 0))} readonly />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No store found</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <PasswordChangeForm />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Ratings</h3>
              <SortableTable
                columns={columns}
                data={sortedRatings}
                onSort={handleSort}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard
