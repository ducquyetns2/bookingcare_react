import './register.scss'
import { useContext, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import validator from '~/services/validator'
import { setLanguage } from '~/store/actions'

function Register() {
    const [state, dispatch] = useContext(Context)
    var translation = Helper.translate(state.language, 'formLog')
    const [eyePassword, setEyePassword] = useState(false)
    const [eyeRePassword, setEyeRePassword] = useState(false)
    const [avatar, setAvatar] = useState()
    const [genders, setGenders] = useState()
    // Define element
    const submitMessage = useRef()
    const closeModal = useRef()
    const openModal = useRef()
    const btnReturn = useRef()
    const handleCloseModal = () => {
        closeModal.current.click()
    }
    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/define/getGender', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(result => {
                setGenders(result.data)
            })
    }, [])
    useEffect(() => {
        validator({
            form: '#form_register',
            errorSelector: '.error_message',
            parentInput: '.parentInput',
            submit: '.register_submit',
            parentSubmit: '.parentSubmit',
            handleSubmit,
            rules: [
                validator.isRequire('#register_fullname', translation.errorMessage.isRequire),
                validator.maxLength('#register_fullname', translation.errorMessage.isMaxlength, 50),

                validator.isRequire('#register_phone', translation.errorMessage.isRequire),
                validator.isNumber('#register_phone', translation.errorMessage.isNumber),
                validator.maxLength('#register_phone', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#register_phone', '#form_register'),

                validator.isRequire('#register_email', translation.errorMessage.isRequire),
                validator.isEmail('#register_email', translation.errorMessage.isEmail),
                validator.maxLength('#register_email', translation.errorMessage.maxLength, 50),

                validator.isRequire('.item_gender', translation.errorMessage.isRequire),

                validator.isRequire('#register_usename', translation.errorMessage.isRequire),
                validator.isAccents('#register_usename', translation.errorMessage.isAccents),
                validator.maxLength('#register_usename', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#register_usename', '#form_register'),

                validator.isRequire('#register_password', translation.errorMessage.isRequire),
                validator.isAccents('#register_password', translation.errorMessage.isAccents),
                validator.minLength('#register_password', translation.errorMessage.minLength, 6),
                validator.maxLength('#register_password', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#register_password', '#form_register'),

                validator.isRequire('#register_rePassword', translation.errorMessage.isRequire),
                validator.isConfirm('#register_rePassword', translation.errorMessage.isConfirm, '#register_password'),
                validator.removeSpace('#register_rePassword', '#form_register'),

                validator.isRequire('#register_avatar', translation.errorMessage.isRequire),
                validator.isFile('#register_avatar', translation.errorMessage.isFile, /\.(jpg|jpeg|png|gif)$/),
            ]
        })
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview)
        }
    }, [avatar, state.language])
    const handleAvatar = (e) => {
        var avatar = e.target.files[0]
        if (avatar) {
            avatar.preview = URL.createObjectURL(avatar)
        }
        setAvatar(avatar)
        e.target.files = undefined
    }
    const handleSubmit = (formValues, inputElements) => {
        // Create Form Data
        const formData = new FormData()
        var formFields = Object.keys(formValues)
        formFields.forEach(field => {
            formData.append(field, formValues[field])
        })
        formData.append('department', 'US')
        // Send data
        fetch('http://localhost:8080/api/user/createUser', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    submitMessage.current.innerText = translation.errorMessage.existUsename
                    toast.error(translation.errorMessage.existUsename, {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                } else {
                    submitMessage.current.innerText = ''
                    // Open modal
                    openModal.current.click()
                    // Reset Data
                    btnReturn.current.onclick = () => {
                        setAvatar()
                        Helper.clearInputData(inputElements, '.parentInput', '.error_message')
                        setEyePassword(false)
                        setEyeRePassword(false)
                    }
                }
            })

    }
    return (
        <div className='background_linear container_register container_form'>
            <form id='form_register' className='form_content'>
                <Link className='return_homePage' to='/'>
                    <i className="fa-solid fa-house"></i>
                </Link>
                <h2 className='form_title'>{translation.register}</h2>
                <div className='change_language register_language'>
                    <span className={(state.language === 'vi') ? 'active' : ''}
                        onClick={() => dispatch(setLanguage('VI'))}>VN</span>/
                    <span className={(state.language === 'en') ? 'active' : ''}
                        onClick={() => dispatch(setLanguage('EN'))}>EN</span>
                </div>
                <div className='grid_row'>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='text' className='animate_input reset_input' id='register_fullname' name='fullName' />
                            <label className='common_label' htmlFor='register_fullname'>{translation.fullname}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='number' pattern='[0-9]*' inputMode='numeric'
                                className='animate_input reset_input' id='register_phone' name='phoneNumber' />
                            <label className='common_label' htmlFor='register_phone'>{translation.phoneNumber}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='text' className='animate_input reset_input' id='register_email' name='email' />
                            <label className='common_label' htmlFor='register_email'>Email</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12 container_gender parentInput container_radio'>
                        <div className='animate_input container_gender'>
                            {genders && genders.map((item, index) => {
                                return (
                                    <div className='col_4_12' key={index}>
                                        <input type='radio' id={`register_gender_${item.valueEn}`} className='item_gender'
                                            value={item.keyMap} name='gender' />
                                        <label htmlFor={`register_gender_${item.valueEn}`}>
                                            {(state.language === 'vi') ? item.valueVi : item.valueEn}</label>
                                    </div>
                                )
                            })}
                        </div>
                        <label className='common_label'>{translation.gender}</label>
                        <p className='error_message'></p>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input reset_input parentInput'>
                            <input type='text' className='animate_input reset_input' id='register_usename' name='useName' />
                            <label className='common_label' htmlFor='register_usename'>{translation.useName}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input password_eye parentInput'>
                            <input type={eyePassword ? 'text' : 'password'} className='animate_input reset_input' id='register_password' name='password' />
                            <label className='common_label' htmlFor='register_password'>{translation.password}</label>
                            <i className={(eyePassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setEyePassword(!eyePassword)}></i>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input password_eye parentInput'>
                            <input type={eyeRePassword ? 'text' : 'password'} className='animate_input reset_input' id='register_rePassword' />
                            <label className='common_label' htmlFor='register_rePassword'>{translation.rePassword}</label>
                            <i className={(eyeRePassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setEyeRePassword(!eyeRePassword)}></i>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput item_avatar'>
                            <input type='file' className='animate_input reset_input input_avatar' id='register_avatar'
                                name='avatar' onChange={handleAvatar} />
                            <label className='common_label' htmlFor='register_avatar'>{translation.avatar}</label>
                            <p className='error_message'></p>
                            {(avatar) ? <div className='preview_image img-fluid'
                                style={{ backgroundImage: `url(${avatar.preview})` }}></div> : ''}
                        </div>
                    </div>
                </div>
                <div className='parentSubmit'>
                    <p className='error_message' ref={submitMessage} style={{ textAlign: 'center' }}></p>
                    <button className='reset_button button_btn register_submit'>{translation.register}</button>
                </div>
                <div className='divide_option'>
                    <div className='divide'></div>
                    <p>{translation.or}</p>
                    <div className='divide'></div>
                </div>
                <Link className='reset_a register_link button_btn background_linear' to='/login'>{translation.login}</Link>
                {/* <!-- Button trigger modal --> */}
                <button type="button" className="btn btn-primary open_modal" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop" ref={openModal} hidden></button>
                {/* <!-- Modal --> */}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title" id="staticBackdropLabel" >{translation.createSucess}</h2>
                                <button type="button" className="btn-close close_modal" data-bs-dismiss="modal"
                                    aria-label="Close" ref={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {translation.createMessage}
                                <span className='owner_name'>Ducquyetns2</span>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn_return_register" ref={btnReturn}
                                    data-bs-dismiss="modal" style={{ fontSize: '1.3rem', marginRight: '10px' }}>{translation.registerAnother}</button>
                                <Link type="button" className="btn btn-primary reset_a" style={{ fontSize: '1.3rem' }} to='/login'
                                    onClick={handleCloseModal}>{translation.toLogin}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div >
    )
}
export default Register