import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SortableTable from '../components/SortableTable'
import StarRating from '../components/StarRating'
import PasswordChangeForm from '../components/PasswordChangeForm'
import { useAuth } from '../contexts/AuthContext'

const Stores = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ name: '', address: '' })
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' })
  const { token } = useAuth()

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setError(null)
        const url = new URL('http://localhost:5000/api/stores')
        // Combine name and address filters into a single search query param for the backend
        const searchParts = []
        if (filters.name) searchParts.push(filters.name)
        if (filters.address) searchParts.push(filters.address)
        if (searchParts.length > 0) {
          url.searchParams.set('search', searchParts.join(' '))
        }
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch stores')
        }
        const data = await response.json()
        setStores(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch stores:', error)
        setError(error.message)
        setStores([])
      } finally {
        setLoading(false)
      }
    }
    fetchStores()
  }, [token, filters])

  const handleRate = async (storeId, rating) => {
    try {
      await fetch(`http://localhost:5000/api/stores/${storeId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating_value: rating })
      })
      // Re-fetch stores with current filters
      const url = new URL('http://localhost:5000/api/stores')
      const searchParts = []
      if (filters.name) searchParts.push(filters.name)
      if (filters.address) searchParts.push(filters.address)
      if (searchParts.length > 0) {
        url.searchParams.set('search', searchParts.join(' '))
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setStores(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to rate store:', error)
    }
  }

  // No need for client-side filtering since backend now handles it with search param
  const filteredStores = stores

  const sortedStores = [...filteredStores].sort((a, b) => {
    const aVal = a[sort.sortBy]?.toLowerCase() || ''
    const bVal = b[sort.sortBy]?.toLowerCase() || ''
    if (sort.sortOrder === 'ASC') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    }
    return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
  })

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'averageRating', label: 'Average Rating', sortable: true, render: (row) => <span className="font-bold text-yellow-600">{Number(row.averageRating || 0).toFixed(1)}</span> },
    { key: 'yourRating', label: 'Your Rating', sortable: false, render: (row) => row.userRating ? <StarRating value={row.userRating} readonly /> : <span className="text-gray-500">Not rated</span> },
    { key: 'action', label: 'Rate', sortable: false, render: (row) => (
      <StarRating
        value={row.userRating || 0}
        onChange={(rating) => handleRate(row.id, rating)}
      />
    )}
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSort = (sortBy, sortOrder) => {
    setSort({ sortBy, sortOrder })
  }

  const filterConfig = {
    name: { label: 'Name', value: filters.name },
    address: { label: 'Address', value: filters.address }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Normal User Dashboard</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <PasswordChangeForm />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Store Search & Browse</h3>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-red-600 text-center">Error: {error}</div>
            ) : (
              <SortableTable
                columns={columns}
                data={sortedStores}
                filters={filterConfig}
                onFilterChange={handleFilterChange}
                onSort={handleSort}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stores
