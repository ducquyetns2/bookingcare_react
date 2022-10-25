import './adminHome.scss'
import { useState, useContext, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import { ToastContainer, toast } from 'react-toastify'
import NavigateAssist from '~/components/adminNavigate/NavigateAssist'
import { language } from '~/store/constant'

function AdminHome() {
    const [state] = useContext(Context)
    const [users, setUsers] = useState()
    const translation = Helper.translate(state.language, 'admin')
    const [deleteUser, setDeleteUser] = useState(false)

    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/user/getAllUser').then(response => response.json())
            .then(result => {
                if (!result.error) {
                    setUsers(result.data)
                }
            })
    }, [deleteUser])
    // Handle Delete User
    var userId = useRef()
    const handleClickDelete = (e) => {
        userId.current = e.target.getAttribute('user-id')
    }
    const handleDeleteUser = (e) => {
        fetch(`http://localhost:8080/api/user/deleteUser/${userId.current}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(result => {
                if (!result.error) {
                    setDeleteUser(!deleteUser)
                    toast.success(translation.deleteSucess, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                } else {
                    toast.error(translation.deleteFail, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            })
    }
    return (
        <div className='admin_home'>
            <div className='home_container'>
                <NavigateAssist title={translation.listAccount} />
                <div className='home_content'>
                    <div className='field_fixed col_4_12'>
                        <table className="table fixed_content">
                            <thead>
                                <tr>
                                    <th style={{ flexBasis: '35%' }}>{translation.action}</th>
                                    <th style={{ flexBasis: '65%' }}>{translation.fullname}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className='table_action' style={{ flexBasis: '35%' }}>
                                                <Link className='fa-solid fa-pen-to-square action_edit reset_a' to={`/adminEdit/${user.id}`}
                                                    title={translation.edit}></Link>
                                                <div className='fa-sharp fa-solid fa-trash-can action_delete' title={translation.delete} user-id={user.id}
                                                    data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleClickDelete}>
                                                </div>
                                            </td>
                                            <td style={{ flexBasis: '65%' }}>{user.fullName}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='field_dynamic col_8_12'>
                        <table className="table dynamic_content">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: '200px' }}>{translation.useName}</th>
                                    <th scope="col" style={{ width: '200px' }}>{translation.password}</th>
                                    <th scope="col" style={{ width: '200px' }}>{translation.phoneNumber}</th>
                                    <th scope="col" style={{ width: '300px' }}>{translation.email}</th>
                                    <th scope="col" style={{ width: '150px' }}>{translation.gender}</th>
                                    <th scope="col" style={{ width: '150px' }}>{translation.avatar}</th>
                                    <th scope="col" style={{ width: '150px' }}>{translation.position}</th>
                                    <th scope="col" style={{ width: '150px' }}>{translation.department}</th>
                                    <th scope="col" style={{ width: '200px' }}>{translation.createdAt}</th>
                                    <th scope="col" style={{ width: '200px' }}>{translation.updatedAt}</th>

                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{ width: '200px' }}>{user.useName}</td>
                                            <td style={{ width: '200px' }}>{user.password}</td>
                                            <td style={{ width: '200px' }}>{user.phoneNumber}</td>
                                            <td style={{ width: '300px' }}>{user.email}</td>
                                            <td style={{ width: '150px' }}>
                                                {(state.language === language.VIETNAMESE) ? user.genderData.valueVi : user.genderData.valueEn}
                                            </td>
                                            <td style={{ width: '150px' }}>
                                                <img src={user.avatarPath} alt='img' />
                                            </td>
                                            <td style={{ width: '150px' }}>
                                                {(state.language === language.VIETNAMESE) ? user.positionData.valueVi : user.positionData.valueEn}
                                            </td>
                                            <td style={{ width: '150px' }}>
                                                {(state.language === language.VIETNAMESE) ? user.departmentData.valueVi : user.departmentData.valueEn}
                                            </td>
                                            <td style={{ width: '200px' }}>{user.createdAt}</td>
                                            <td style={{ width: '200px' }}>{user.updatedAt}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* <!-- Delete Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="exampleModalLabel">{translation.deleteTitle}</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {translation.deleteConfirm}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                style={{ fontSize: '1.5rem', padding: '5px 20px', marginRight: '15px' }}>{translation.close}</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                style={{ fontSize: '1.5rem', padding: '5px 20px' }} onClick={handleDeleteUser}>{translation.delete}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Toastify  */}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}
export default AdminHome