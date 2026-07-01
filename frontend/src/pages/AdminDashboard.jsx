import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SortableTable from '../components/SortableTable'
import StarRating from '../components/StarRating'
import PasswordChangeForm from '../components/PasswordChangeForm'
import { useAuth } from '../contexts/AuthContext'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 })
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', address: '', role: 'normal_user' })
  const [storeFormData, setStoreFormData] = useState({ name: '', email: '', address: '', owner_id: '' })
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' })
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' })
  const [userSort, setUserSort] = useState({ sortBy: 'name', sortOrder: 'ASC' })
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', sortOrder: 'ASC' })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const { token } = useAuth()

  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, storesRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:5000/api/admin/users?sortBy=${userSort.sortBy}&sortOrder=${userSort.sortOrder}&name=${userFilters.name}&email=${userFilters.email}&address=${userFilters.address}&role=${userFilters.role}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:5000/api/admin/stores?sortBy=${storeSort.sortBy}&sortOrder=${storeSort.sortOrder}&name=${storeFilters.name}&email=${storeFilters.email}&address=${storeFilters.address}`, { headers: { Authorization: `Bearer ${token}` } })
        ])
        const statsData = await statsRes.json()
        const usersData = await usersRes.json()
        const storesData = await storesRes.json()
        setStats(statsData || { totalUsers: 0, totalStores: 0, totalRatings: 0 })
        setUsers(Array.isArray(usersData) ? usersData : [])
        setStores(Array.isArray(storesData) ? storesData : [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token, userSort, storeSort, userFilters, storeFilters])

  const handleUserFormSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (userFormData.name.length < 20 || userFormData.name.length > 60) {
      setFormError('Name must be 20-60 characters')
      return
    }
    if (!passwordPattern.test(userFormData.password)) {
      setFormError('Password must be 8-16 characters, include at least one uppercase letter and one special character')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userFormData)
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to add user')
      }
      setFormSuccess('User added successfully!')
      setUserFormData({ name: '', email: '', password: '', address: '', role: 'normal_user' })
      const usersRes = await fetch(`http://localhost:5000/api/admin/users?sortBy=${userSort.sortBy}&sortOrder=${userSort.sortOrder}&name=${userFilters.name}&email=${userFilters.email}&address=${userFilters.address}&role=${userFilters.role}`, { headers: { Authorization: `Bearer ${token}` } })
      setUsers(await usersRes.json())
    } catch (err) {
      setFormError(err.message)
    }
  }

  const handleStoreFormSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (storeFormData.name.length < 20 || storeFormData.name.length > 60) {
      setFormError('Store name must be 20-60 characters')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(storeFormData)
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to add store')
      }
      setFormSuccess('Store added successfully!')
      setStoreFormData({ name: '', email: '', address: '', owner_id: '' })
      const storesRes = await fetch(`http://localhost:5000/api/admin/stores?sortBy=${storeSort.sortBy}&sortOrder=${storeSort.sortOrder}&name=${storeFilters.name}&email=${storeFilters.email}&address=${storeFilters.address}`, { headers: { Authorization: `Bearer ${token}` } })
      setStores(await storesRes.json())
    } catch (err) {
      setFormError(err.message)
    }
  }

  const userColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (row) => <span className="capitalize">{row.role.replace('_', ' ')}</span> },
    { key: 'storeRating', label: 'Store Rating', sortable: false, render: (row) => row.role === 'store_owner' && row.Stores?.length > 0 ? (
      <div>
        {row.Stores.map(store => (
          <div key={store.id}>
            <span className="font-medium">{store.name}:</span>
            {store.Ratings?.length > 0 ? (
              <StarRating value={store.Ratings.reduce((a, b) => a + b.rating_value, 0) / store.Ratings.length} readonly />
            ) : (
              <span className="text-gray-500 ml-2">No ratings</span>
            )}
          </div>
        ))}
      </div>
    ) : <span className="text-gray-500">N/A</span> }
  ]

  const storeColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'owner', label: 'Owner', sortable: false, render: (row) => row.User?.name || 'N/A' }
  ]

  const handleUserFilterChange = (key, value) => {
    setUserFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleStoreFilterChange = (key, value) => {
    setStoreFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleUserSort = (sortBy, sortOrder) => {
    setUserSort({ sortBy, sortOrder })
  }

  const handleStoreSort = (sortBy, sortOrder) => {
    setStoreSort({ sortBy, sortOrder })
  }

  const userFilterConfig = {
    name: { label: 'Name', value: userFilters.name },
    email: { label: 'Email', value: userFilters.email },
    address: { label: 'Address', value: userFilters.address },
    role: {
      label: 'Role',
      value: userFilters.role,
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'normal_user', label: 'Normal User' },
        { value: 'store_owner', label: 'Store Owner' }
      ]
    }
  }

  const storeFilterConfig = {
    name: { label: 'Name', value: storeFilters.name },
    email: { label: 'Email', value: storeFilters.email },
    address: { label: 'Address', value: storeFilters.address }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</div>
                  <div className="mt-1 text-gray-500">Total Users</div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-3xl font-bold text-indigo-600">{stats.totalStores}</div>
                  <div className="mt-1 text-gray-500">Total Stores</div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-3xl font-bold text-indigo-600">{stats.totalRatings}</div>
                  <div className="mt-1 text-gray-500">Total Ratings</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <PasswordChangeForm />
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md font-medium ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Manage Users
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`px-4 py-2 rounded-md font-medium ${activeTab === 'stores' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Manage Stores
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                {formSuccess}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Add New User</h3>
                  <form onSubmit={handleUserFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={userFormData.name}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={userFormData.password}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={userFormData.role}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="normal_user">Normal User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={userFormData.address}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">All Users</h3>
                  <SortableTable
                    columns={userColumns}
                    data={users}
                    filters={userFilterConfig}
                    onFilterChange={handleUserFilterChange}
                    onSort={handleUserSort}
                  />
                </div>
              </div>
            )}

            {activeTab === 'stores' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Store</h3>
                  <form onSubmit={handleStoreFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                      <input
                        type="text"
                        value={storeFormData.name}
                        onChange={(e) => setStoreFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={storeFormData.email}
                        onChange={(e) => setStoreFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner ID</label>
                      <input
                        type="number"
                        value={storeFormData.owner_id}
                        onChange={(e) => setStoreFormData(prev => ({ ...prev, owner_id: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={storeFormData.address}
                        onChange={(e) => setStoreFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add Store
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">All Stores</h3>
                  <SortableTable
                    columns={storeColumns}
                    data={stores}
                    filters={storeFilterConfig}
                    onFilterChange={handleStoreFilterChange}
                    onSort={handleStoreSort}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
