import './login.scss'
import { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import validator from '~/services/validator'
import { setLanguage, login } from '~/store/actions'
import { ToastContainer, toast } from 'react-toastify'
import Select from 'react-select'
import { language, department, actions } from '~/store/constant'

function Login({ setDepartment }) {
    const navigate = useNavigate()
    const [state, dispatch] = useContext(Context)
    var translation = Helper.translate(state.language, 'formLog')
    const [eye, setEye] = useState(false)
    const submitMessage = useRef()
    const [selectedDepartment, setSelectedDepartment] = useState(department.USER)
    const [departments, setDepartments] = useState()
    // Define options 
    const [departmentOptions, setDepartmentOptions] = useState()
    useEffect(() => {
        if (setDepartment) {
            fetch('http://localhost:8080/api/define/getDepartment').then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        setDepartments(result.data)
                    }
                })
        }
    }, [])
    useEffect(() => {
        departments && setDepartmentOptions(Helper.createSelectOptions(departments, state.language, 'define'))
    }, [departments, state.language])
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
    }, [state.language, selectedDepartment])
    const handleSubmit = (formValues) => {
        if (setDepartment) {
            formValues.department = selectedDepartment
        }
        fetch('http://localhost:8080/api/user/compareUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues)
        }).then(response => response.json())
            .then((result) => {
                if (result.error) {
                    if (setDepartment) {
                        submitMessage.current.innerText = translation.errorMessage.wrongDetailUser
                        toast.error(translation.errorMessage.wrongDetailUser, {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    } else {
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
                    }
                } else {
                    submitMessage.current.innerText = ''
                    let data = result.data
                    dispatch(login(actions.LOGIN, {
                        ...data,
                    }))
                    switch (selectedDepartment) {
                        case department.DOCTOR:
                            navigate('/admin/manageDoctor')
                            break
                        case department.ADMIN:
                            navigate('/admin')
                            break
                        default:
                            navigate('/')
                    }
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
                    <span className={(state.language === language.VIETNAMESE) ? 'active' : ''}
                        onClick={() => dispatch(setLanguage(language.VIETNAMESE))}>VN</span>/
                    <span className={(state.language === language.ENGLISH) ? 'active' : ''}
                        onClick={() => dispatch(setLanguage(language.ENGLISH))}>EN</span>
                </div>
                <div className='parentInput'>
                    <input type='text' className='reset_input animate_input' id='login_usename' name='useName' />
                    <label htmlFor='login_usename' className='common_label' >{translation.useName} </label>
                    <p className='error_message'></p>
                </div>
                <div className='login_password password_eye parentInput'>
                    <input type={(eye) ? 'text' : 'password'} className='reset_input animate_input' id='login_password'
                        name='password' />
                    <label htmlFor='login_password' className='common_label'>{translation.password}</label>
                    <p className='error_message'></p>
                    <i className={(eye) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                        onClick={() => setEye(!eye)}></i>
                </div>
                {setDepartment && <div className='item_department parentInput'>
                    <Select options={departmentOptions} placeholder={translation.errorMessage.isChoose}
                        onChange={(e) => setSelectedDepartment(e.value)} className='z_index has_data'
                        value={departmentOptions && departmentOptions.find((item) => item.value === selectedDepartment)} />
                    <label className='common_label'>{translation.department}</label>
                    <p className='error_message'></p>
                </div>}
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