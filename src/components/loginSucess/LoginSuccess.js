import './loginSuccess.scss'
import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '~/store/Provider'
import validator from '~/services/validator'
import Helper from '~/services/Helper'
import { logout } from '~/store/actions'
import { actions } from '~/store/constant'

function LoginSuccess({ formatId }) {
    const [eyePassword, setEyePassword] = useState(false)
    const [eyeNewPassword, setEyeNewPassword] = useState(false)
    const [eyeConfirmPassword, setEyeConfirmPassword] = useState(false)
    const navigation = useNavigate()
    const [state, dispatch] = useContext(Context)
    const translation = Helper.translate(state.language, 'homePage').header
    var errorFormlog = Helper.translate(state.language, 'formLog')
    // Define element
    const formContainer = useRef()
    const successPassword = useRef()
    const errorPassword = useRef()
    const handleLogout = () => {
        dispatch(logout(actions.LOGOUT))
        navigation('/login')
    }
    useEffect(() => {
        validator({
            form: `#${formatId}_form_change_password`,
            parentInput: '.parentInput',
            errorSelector: '.error_message',
            submit: '.change_password_submit',
            parentSubmit: '.parentSubmit',
            handleSubmit,
            rules: [
                validator.isRequire(`#${formatId}_current_password`, errorFormlog.errorMessage.isRequire),
                validator.isAccents(`#${formatId}_current_password`, errorFormlog.errorMessage.isAccents),

                validator.isRequire(`#${formatId}_new_password`, errorFormlog.errorMessage.isRequire),
                validator.isAccents(`#${formatId}_new_password`, errorFormlog.errorMessage.isAccents),
                validator.minLength(`#${formatId}_new_password`, errorFormlog.errorMessage.minLength, 6),
                validator.maxLength(`#${formatId}_new_password`, errorFormlog.errorMessage.maxLength, 20),
                validator.isSimilar(`#${formatId}_new_password`, errorFormlog.errorMessage.isSimilar, `#${formatId}_current_password`),
                validator.removeSpace(`#${formatId}_new_password`, `#${formatId}_form_change_password`),

                validator.isRequire(`#${formatId}_confirm_new_password`, errorFormlog.errorMessage.isRequire),
                validator.isConfirm(`#${formatId}_confirm_new_password`, errorFormlog.errorMessage.isConfirm, `#${formatId}_new_password`),
                validator.removeSpace(`#${formatId}_confirm_new_password`, `#${formatId}_form_change_password`),
            ]
        })
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
                    Helper.clearInputData(inputElements)
                    successPassword.current.innerText = translation.successPassword
                }
            })
    }
    return (
        <div className="btn-group login_success">
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
                    <form className="modal-content container_change_password" style={{ padding: '0 20px' }}
                        id={`${formatId}_form_change_password`} ref={formContainer}>
                        <div className="modal-header">
                            <h3 className="modal-title">{translation.changePassword}</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close" onClick={handleClearData}></button>
                        </div>
                        <div className="modal-body">
                            <div className='password_eye parentInput'>
                                <input type={(eyePassword) ? 'text' : 'password'} className='reset_input animate_input'
                                    id={`${formatId}_current_password`} name='currentPassword' />
                                <label htmlFor={`${formatId}_current_password`} className='common_label'>{translation.currentPassword}</label>
                                <p className='error_message' ref={errorPassword}></p>
                                <i className={(eyePassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                    onClick={() => setEyePassword(!eyePassword)}></i>
                            </div>
                            <div className='password_eye parentInput'>
                                <input type={(eyeNewPassword) ? 'text' : 'password'} className='reset_input animate_input' id={`${formatId}_new_password`} name='newPassword' />
                                <label htmlFor={`${formatId}_new_password`} className='common_label'>{translation.newPassword}</label>
                                <p className='error_message'></p>
                                <i className={(eyeNewPassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                    onClick={() => setEyeNewPassword(!eyeNewPassword)}></i>
                            </div>
                            <div className='password_eye parentInput'>
                                <input type={(eyeConfirmPassword) ? 'text' : 'password'} className='reset_input animate_input' id={`${formatId}_confirm_new_password`} name='confirmNewPassword' />
                                <label htmlFor={`${formatId}_confirm_new_password`} className='common_label'>{translation.confirmNewPassword}</label>
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
        </div>
    )
}
export default LoginSuccess