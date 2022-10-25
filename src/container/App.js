import '~/assets/styles/base.scss';
import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react';
import { Context } from '~/store/Provider'
import { department, position } from '~/store/constant'
// Route Page
import HomePage from './homePage'
import Login from './formLog/login/Login'
import Register from './formLog/register/Register'
import UserEdit from './formLog/userEdit/UserEdit'
import DetailContainer from './detail/DetailContainer'
// Route Admin
import AdminNavigate from '~/components/adminNavigate/AdminNavigate';
import AdminHome from './admin/adminHome/AdminHome'
import AdminEdit from './admin/adminEdit/AdminEdit';
import AdminRegister from './admin/adminRegister/AdminRegister';
import DetailDoctor from '../container/detail/DetailDoctor'
import ManageDoctor from './admin/adminManage/ManageDoctor'
import ManageHospital from './admin/adminManage/ManageHospital'
import ManageHandbook from './admin/adminManage/ManageHandbook'
import ManageSchedule from './admin/adminManage/ManageSchedule';
import ManageSpecialty from './admin/adminManage/ManageSpecialty'

function App() {
  const [state] = useContext(Context)
  return (
    <Routes>
      {/* Route User */}
      <Route path='/' element={<DetailContainer />}>
        <Route index element={<HomePage />} />
        <Route path='detailDoctor/:id' element={<DetailDoctor />} />
      </Route>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/userEdit' element={(state.login) ? <UserEdit /> : <Navigate to='/login' />} />
      {/* Route Admin */}
      <Route path='/login/setDepartment' element={<Login setDepartment={true} />} />
      <Route path='/adminRegister' element={(state.login && (state.department === department.DOCTOR || state.department === department.ADMIN)) ?
        <AdminRegister /> : <Navigate to='/login/setDepartment' />} />
      <Route path='/adminEdit/:id' element={(state.login && state.department === department.ADMIN) ?
        <AdminEdit /> : <Navigate to='/login/setDepartment' />} />
      <Route path='/admin' element={<AdminNavigate />}>
        <Route index element={(state.login && state.department === department.ADMIN) ?
          <AdminHome /> : <Navigate to='/login/setDepartment' />} />
        <Route path='manageDoctor' element={(state.login && (state.department === department.DOCTOR || state.department === department.ADMIN)) ?
          <ManageDoctor /> : <Navigate to='/login/setDepartment' />} />
        <Route path='manageSchedule' element={(state.login && (state.department === department.DOCTOR || state.department === department.ADMIN)) ?
          <ManageSchedule /> : <Navigate to='/login/setDepartment' />} />
        <Route path='manageHospital' element={(state.login && state.department === department.ADMIN) ?
          <ManageHospital /> : <Navigate to='/login/setDepartment' />} />
        <Route path='manageHandbook' element={(state.login && state.department === department.ADMIN) ?
          <ManageHandbook /> : <Navigate to='/login/setDepartment' />} />
        <Route path='manageSpecialty' element={(state.login && state.department === department.ADMIN) ?
          <ManageSpecialty /> : <Navigate to='/login/setDepartment' />} />
      </Route>
    </Routes>
  )
}
export default App;
