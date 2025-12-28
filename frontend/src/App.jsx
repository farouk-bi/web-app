import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
}
  from 'react-router-dom'
import ManageTasks from './pages/admin/ManageTasks'
import CreateTask from './pages/admin/CreateTask'
import ManageUsers from './pages/admin/ManageUsers'
import Dashboard from './pages/admin/Dashboard'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import MyTasks from './pages/user/MyTasks'
import ViewTaskDetails from './pages/user/ViewTaskDetails'
import PrivateRoute from './routes/PrivateRoute'
import UserProvider, { UserContext } from './context/userContext'
import UserDashboard from './pages/user/UserDashboard'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
//admin routes
            <Route element={<PrivateRoute allowedRoles={['admin']} />} >
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
              <Route path='/admin/users' element={<ManageUsers />} />
            </Route>
//user routes
            <Route element={<PrivateRoute allowedRoles={['admin', 'user']} />} >
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/tasks' element={<MyTasks />} />
              <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />

            </Route>
//default route
            <Route path='/' element={<Root />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <Outlet />;
  if (!user) return <Navigate to='/login' />;
  return user.role === 'admin' ? <Navigate to='/admin/dashboard' /> : <Navigate to='/user/dashboard' />;
}