import './adminNavigate.scss'
import { useContext, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import LoginSuccess from '../loginSucess/LoginSuccess'
import { department } from '~/store/constant'

function AdminNavigate() {
    const [state] = useContext(Context)
    const location = useLocation()
    // Define elements
    const navbarList = useRef()
    const userLink = useRef()
    const doctorLink = useRef()
    const handbookLink = useRef()
    const hospitalLink = useRef()
    const specialtyLink = useRef()
    const manageDoctorLink = useRef()
    const manageScheduleLink = useRef()
    // Handle Link active
    useEffect(() => {
        let urlArray = location.pathname.split('/')
        let lastUrl = urlArray.pop()
        // Remove actvie
        let activeElement = navbarList.current.querySelector('.active')
        activeElement && activeElement.classList.remove('active')
        if (state.department === department.ADMIN) {
            switch (lastUrl) {
                case 'admin':
                    userLink.current && userLink.current.classList.add('active')
                    break
                case 'manageDoctor':
                case 'manageSchedule':
                    doctorLink.current && doctorLink.current.classList.add('active')
                    break
                case 'manageHandbook':
                    handbookLink.current && handbookLink.current.classList.add('active')
                    break
                case 'manageSpecialty':
                    specialtyLink.current && specialtyLink.current.classList.add('active')
                    break
                case 'manageHospital':
                    hospitalLink.current && hospitalLink.current.classList.add('active')
                    break
                default:
            }
        } else {
            switch (lastUrl) {
                case 'manageDoctor':
                    manageDoctorLink.current && manageDoctorLink.current.classList.add('active')
                    break
                case 'manageSchedule':
                    manageScheduleLink.current && manageScheduleLink.current.classList.add('active')
                    break
                default:
            }
        }
    })
    const translation = Helper.translate(state.language, 'admin')
    return (
        <div className='admin_navigate'>
            <nav className="navbar navbar-dark navbar-expand-lg bg-primary" >
                <div className="container-fluid">
                    <LoginSuccess formatId='admin_navigate' />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse container_navbar" id="navbarTogglerDemo02">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar_list" ref={navbarList}>
                            {(state.department === department.ADMIN) ? <>
                                <li className="nav-item nav-link" ref={hospitalLink}>
                                    <Link className="dropdown-item reset_a" to='/admin/manageHospital'>{translation.hospital}</Link>
                                </li>
                                <li className="nav-item nav-link" ref={handbookLink}>
                                    <Link className="dropdown-item reset_a" to='/admin/manageHandbook'>{translation.handbook}</Link>
                                </li>
                                <li className="nav-item nav-link" ref={userLink}>
                                    <Link className="dropdown-item reset_a" to='/admin'>{translation.user}</Link>
                                </li>
                                <li className="nav-item nav-link" ref={specialtyLink}>
                                    <Link className="dropdown-item reset_a" to='/admin/manageSpecialty'>{translation.specialty}</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                        data-bs-toggle="dropdown" aria-expanded="false" ref={doctorLink}>
                                        {translation.doctor}
                                    </a>
                                    <ul className="dropdown-menu doctor_list" aria-labelledby="navbarDropdownMenuLink">
                                        <li>
                                            <Link className="dropdown-item reset_a" to='/admin/manageDoctor'>{translation.manageDoctor}</Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item reset_a" to='/admin/manageSchedule'>{translation.manageSchedule}</Link>
                                        </li>
                                    </ul>
                                </li>
                            </> :
                                <>
                                    <li className="nav-item nav-link" ref={manageDoctorLink}>
                                        <Link className="dropdown-item reset_a" to='/admin/manageDoctor'>{translation.manageDoctor}</Link>
                                    </li>
                                    <li className="nav-item nav-link" ref={manageScheduleLink}>
                                        <Link className="dropdown-item reset_a" to='/admin/manageSchedule'>{translation.manageSchedule}</Link>
                                    </li>
                                </>}
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    )
}
export default AdminNavigate