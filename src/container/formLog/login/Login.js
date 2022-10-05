import './login.scss'
import { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import validator from '~/services/validator'
import { setLanguage, login } from '~/store/actions'
import { ToastContainer, toast } from 'react-toastify'

function Login() {
    const navigation = useNavigate()
    const [state, dispatch] = useContext(Context)
    var translation = Helper.translate(state.language, 'formLog')
    const [eye, setEye] = useState(false)
    const submitMessage = useRef()
    useEffect(() => {
        validator({
            form: '#form_login',
            errorSelector: '.error_message',
            parentInput: '.parentInput',
            submit: '.login_submit',
            parentSubmit: '.parentSubmit',
            handleSubmit,
            rules: [
                validator.isRequire('#login_usename', translation.errorMessage.isRequire),
                validator.isAccents('#login_usename', translation.errorMessage.isAccents),
                validator.removeSpace('#login_password', '#form_login'),

                validator.isRequire('#login_password', translation.errorMessage.isRequire),
                validator.isAccents('#login_password', translation.errorMessage.isAccents),
                validator.removeSpace('#login_password', '#form_login'),
            ]
        })
    })
    const handleSubmit = (formValues) => {
        fetch('http://localhost:8080/api/user/compareUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues)
        }).then(response => response.json())
            .then((result) => {
                if (result.error) {
                    submitMessage.current.innerText = translation.errorMessage.wrongUser
                    toast.error(translation.errorMessage.wrongUser, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                } else {
                    submitMessage.current.innerText = ''
                    let data = result.data
                    dispatch(login('LOGIN', {
                        ...data,
                        login: true
                    }))
                    navigation('/')
                }
            })
    }
    return (
        <div className='background_linear container_login container_form'>
            <form id='form_login' className='form_content'>
                <Link className='return_homePage' to='/'>
                    <i className="fa-solid fa-house"></i>
                </Link>
                <h2 className='form_title'>{translation.login}</h2>
                <div className='change_language login_language'>
                    <span className={(state.language === 'vi') ? 'active' : ''}
                        onClick={() => dispatch(setLanguage('VI'))}>VN</span>/
                    <span className={(state.language === 'en') ? 'active' : ''}
                        onClick={() => dispatch(setLanguage('EN'))}>EN</span>
                </div>
                <div className='parentInput'>
                    <input type='text' className='reset_input animate_input' id='login_usename' name='useName' />
                    <label htmlFor='login_usename' className='common_label' >{translation.useName} </label>
                    <p className='error_message'></p>
                </div>
                <div className='login_password password_eye parentInput'>
                    <input type={(eye) ? 'text' : 'password'} className='reset_input animate_input' id='login_password' name='password' />
                    <label htmlFor='login_password' className='common_label'>{translation.password}</label>
                    <p className='error_message'></p>
                    <i className={(eye) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                        onClick={() => setEye(!eye)}></i>
                </div>
                <p className='login_forgetPassword'>{translation.forgotPassword}</p>
                <div className='parentSubmit'>
                    <p className='error_message' ref={submitMessage}></p>
                    <button className='reset_button form_submit background_linear button_btn login_submit'>
                        {translation.login}</button>
                </div>
                <div className='divide_option'>
                    <div className='divide'></div>
                    <p>{translation.or}</p>
                    <div className='divide'></div>
                </div>
                <Link className='login_link reset_button button_btn reset_a' to='/register'>{translation.createUser}</Link>
            </form>
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
export default Login