import './navigation.scss'
import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '~/store/Provider'
import validator from '~/services/validator'
import Helper from '~/services/Helper'
import { setLanguage, logout } from '~/store/actions'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

function Navigation() {
    const [eyePassword, setEyePassword] = useState(false)
    const [eyeNewPassword, setEyeNewPassword] = useState(false)
    const [eyeConfirmPassword, setEyeConfirmPassword] = useState(false)
    const navigation = useNavigate()
    const [state, dispatch] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage')
    translation = translation.header
    var errorFormlog = Helper.translate(state.language, 'formLog')
    // Define element
    const formContainer = useRef()
    const successPassword = useRef()
    const errorPassword = useRef()
    const handleLogout = () => {
        dispatch(logout('LOGOUT'))
        navigation('/login')
    }
    useEffect(() => {
        if (state.login) {
            validator({
                form: '#form_change_password',
                parentInput: '.parentInput',
                errorSelector: '.error_message',
                submit: '.change_password_submit',
                parentSubmit: '.parentSubmit',
                handleSubmit,
                rules: [
                    validator.isRequire('#current_password', errorFormlog.errorMessage.isRequire),
                    validator.isAccents('#current_password', errorFormlog.errorMessage.isAccents),

                    validator.isRequire('#new_password', errorFormlog.errorMessage.isRequire),
                    validator.isAccents('#new_password', errorFormlog.errorMessage.isAccents),
                    validator.minLength('#new_password', errorFormlog.errorMessage.minLength, 6),
                    validator.maxLength('#new_password', errorFormlog.errorMessage.maxLength, 20),
                    validator.isSimilar('#new_password', errorFormlog.errorMessage.isSimilar, '#current_password'),
                    validator.removeSpace('#new_password', '#form_change_password'),

                    validator.isRequire('#confirm_new_password', errorFormlog.errorMessage.isRequire),
                    validator.isConfirm('#confirm_new_password', errorFormlog.errorMessage.isConfirm, '#new_password'),
                    validator.removeSpace('#confirm_new_password', '#form_change_password'),
                ]
            })
        }
    }, [state.language])
    const handleClearData = () => {
        const $$ = formContainer.current.querySelectorAll.bind(formContainer.current)
        const enableInputs = $$('input:not([disabled])')
        Helper.clearInputData(enableInputs, '.parentInput', '.error_message')
        successPassword.current.innerText = ''
        // handle eye to default 
        setEyePassword(false)
        setEyeNewPassword(false)
        setEyeConfirmPassword(false)
    }
    const handleSubmit = (formValues, inputElements) => {
        formValues.useName = state.useName
        fetch('http://localhost:8080/api/user/changePassword', {
            method: 'PUT',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        }).then(response => response.json())
            .then(result => {
                if (result.error) {
                    successPassword.current.innerText = ''
                    errorPassword.current.innerText = errorFormlog.errorMessage.wrongPassword
                } else {
                    Helper.clearInputData(inputElements, '.parentInput', '.error_message')
                    successPassword.current.innerText = translation.successPassword
                }
            })
    }
    return <div className='navigation'>
        <div className='header_logo'>
            <i className="menu fa-solid fa-bars"></i>
            <a href='#'>
                <img src='https://bookingcare.vn/assets/icon/bookingcare-2020.svg' alt='img' />
            </a>
        </div>
        <div className='header_category'>
            <ul className='list_category reset_ul'>
                <li className='item_category'>
                    <a className='reset_a' href='#'> {translation.specialist}
                        <p>{translation.findDoctor}</p>
                    </a>
                </li>
                <li className='item_category'>
                    <a className='reset_a' href='#'>{translation.facility}
                        <p>{translation.selectHospital}</p>
                    </a>
                </li>
                <li className='item_category'>
                    <a className='reset_a' href='#'> {translation.doctor}
                        <p>{translation.selectDoctor}</p>
                    </a>
                </li>
                <li className='item_category'>
                    <a className='reset_a' href='#'> {translation.packageCheck}
                        <p>{translation.checkHeath}</p>
                    </a>
                </li>
            </ul>
        </div>
        <div className='header_button'>
            <div className='header_assist'>
                <a className='assist'>
                    <i className="fa-solid fa-circle-question"></i>
                    <span>{translation.assist}</span>
                </a>
                <div className='change_language'>
                    <span className={(state.language === 'vi') ? 'active' : ''}
                        onClick={() => dispatch(setLanguage('VI'))}>VN</span>/
                    <span className={(state.language === 'en') ? 'active' : ''}
                        onClick={() => dispatch(setLanguage('EN'))}>EN</span>
                </div>
            </div>
            {(state.login) ?
                <div className="btn-group header_user">
                    <h4 className='name_user'>{translation.hello}, {state.useName}</h4>
                    <div className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: 'none' }}>
                        <img src={state.avatarPath} className='avatar_user' />
                    </div>
                    <ul className="dropdown-menu user_select">
                        <li className='dropdown-item change_password_btn' data-bs-toggle="modal"
                            data-bs-target="#exampleModal">{translation.changePassword}</li>
                        <Link className='dropdown-item modify_infor_btn' to='/userEdit' style={{ fontSize: '1.4rem', opacity: '0.8' }}>{translation.modifyInfor}</Link>
                        <li className='dropdown-item logout_user_btn' onClick={handleLogout}>{translation.logOut}</li>
                        <li className="dropdown-divider"></li>
                        <li>{state.fullName}</li>
                    </ul>
                    {/* <!-- Modal Change Password--> */}
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                        aria-hidden="true" onClick={handleClearData}>
                        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                            {/* Form change Password */}
                            <form className="modal-content" style={{ padding: '0 20px' }} id='form_change_password' ref={formContainer}>
                                <div className="modal-header">
                                    <h3 className="modal-title" id="exampleModalLabel">{translation.changePassword}</h3>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close" onClick={handleClearData}></button>
                                </div>
                                <div className="modal-body">
                                    <div className='password_eye parentInput'>
                                        <input type={(eyePassword) ? 'text' : 'password'} className='reset_input animate_input'
                                            id='current_password' name='currentPassword' />
                                        <label htmlFor='current_password' className='common_label'>{translation.currentPassword}</label>
                                        <p className='error_message' ref={errorPassword}></p>
                                        <i className={(eyePassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                            onClick={() => setEyePassword(!eyePassword)}></i>
                                    </div>
                                    <div className='password_eye parentInput'>
                                        <input type={(eyeNewPassword) ? 'text' : 'password'} className='reset_input animate_input' id='new_password' name='newPassword' />
                                        <label htmlFor='new_password' className='common_label'>{translation.newPassword}</label>
                                        <p className='error_message'></p>
                                        <i className={(eyeNewPassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                            onClick={() => setEyeNewPassword(!eyeNewPassword)}></i>
                                    </div>
                                    <div className='password_eye parentInput'>
                                        <input type={(eyeConfirmPassword) ? 'text' : 'password'} className='reset_input animate_input' id='confirm_new_password' name='confirmNewPassword' />
                                        <label htmlFor='confirm_new_password' className='common_label'>{translation.confirmNewPassword}</label>
                                        <p className='error_message'></p>
                                        <i className={(eyeConfirmPassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                            onClick={() => setEyeConfirmPassword(!eyeConfirmPassword)}></i>
                                    </div>
                                </div>
                                <div className="modal-footer parentSubmit">
                                    <p className='error_message' style={{ marginTop: '0', justifyContent: 'center' }} ref={successPassword}></p>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={{ fontSize: '1.4rem' }}
                                        onClick={handleClearData}>{translation.cancelChange}</button>
                                    <button type="submit" className="btn btn-primary change_password_submit" style={{ fontSize: '1.4rem' }}>{translation.saveChange}</button>
                                </div>
                            </form>
                        </div>
                    </div>
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
                :
                <div className='header_link'>
                    <Link className='btn btn-primary' to='login'>{translation.login}</Link>
                    <Link className="btn btn-success" to='register'>{translation.register}</Link>
                </div>}
        </div>
        <Outlet></Outlet>
    </div>
}
export default Navigation