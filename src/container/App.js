import '~/assets/styles/base.scss';
import { Routes, Route } from 'react-router-dom'
import HomePage from './homePage'
import Login from './formLog/login/Login'
import Register from './formLog/register/Register'
import UserEdit from './formLog/userEdit/UserEdit'
import AdminHome from './admin/adminHome/AdminHome'
import AdminEdit from './admin/adminEdit/AdminEdit';
import AdminRegister from './admin/adminRegister/AdminRegister';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/userEdit' element={<UserEdit />} />
      <Route path='/admin' element={<AdminHome />} />
      <Route path='/adminEdit/:id' element={<AdminEdit />} />
      <Route path='/adminRegister' element={<AdminRegister />} />
    </Routes>
  )
}
export default App;
