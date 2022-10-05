import './adminRegister.scss'
import { useContext, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import validator from '~/services/validator'
import { setLanguage } from '~/store/actions'

function AdminRegister() {
    const navigate = useNavigate()
    const [state, dispatch] = useContext(Context)
    var translation = Helper.translate(state.language, 'formLog')
    const [eyePassword, setEyePassword] = useState(false)
    const [eyeRePassword, setEyeRePassword] = useState(false)
    const [avatar, setAvatar] = useState()
    // Save API
    const [genders, setGenders] = useState()
    const [positions, setPositions] = useState()
    const [departments, setDepartments] = useState()
    // Set default value
    const [userPosition, setUserPosition] = useState('NO')
    const [userDepartment, setUserDepartment] = useState('US')
    // Define element
    const submitMessage = useRef()
    const closeModal = useRef()
    const openModal = useRef()
    const btnReturn = useRef()
    const handleGoBack = () => {
        navigate(-1)
    }
    const handleCloseModal = () => {
        closeModal.current.click()
    }
    useLayoutEffect(() => {
        // Get Gender Data
        fetch('http://localhost:8080/api/define/getGender', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(result => {
                setGenders(result.data)
            })
        // Get Position Data
        fetch('http://localhost:8080/api/define/getPosition', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(result => {
                setPositions(result.data)
            })
        // Get Department Data
        fetch('http://localhost:8080/api/define/getDepartment', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(result => {
                setDepartments(result.data)
            })
    }, [])
    useEffect(() => {
        validator({
            form: '#form_adminRegister',
            errorSelector: '.error_message',
            parentInput: '.parentInput',
            submit: '.adminRegister_submit',
            parentSubmit: '.parentSubmit',
            handleSubmit,
            rules: [
                validator.isRequire('#adminRegister_fullname', translation.errorMessage.isRequire),
                validator.maxLength('#adminRegister_fullname', translation.errorMessage.isMaxlength, 50),

                validator.isRequire('#adminRegister_phone', translation.errorMessage.isRequire),
                validator.isNumber('#adminRegister_phone', translation.errorMessage.isNumber),
                validator.maxLength('#adminRegister_phone', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#adminRegister_phone', '#form_adminRegister'),

                validator.isRequire('#adminRegister_email', translation.errorMessage.isRequire),
                validator.isEmail('#adminRegister_email', translation.errorMessage.isEmail),
                validator.maxLength('#adminRegister_email', translation.errorMessage.maxLength, 50),

                validator.isRequire('.item_gender', translation.errorMessage.isRequire),

                validator.isRequire('.adminRegister_position', translation.errorMessage.isRequire),

                validator.isRequire('.adminRegister_department', translation.errorMessage.isRequire),

                validator.isRequire('#adminRegister_usename', translation.errorMessage.isRequire),
                validator.isAccents('#adminRegister_usename', translation.errorMessage.isAccents),
                validator.maxLength('#adminRegister_usename', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#adminRegister_usename', '#form_adminRegister'),

                validator.isRequire('#adminRegister_password', translation.errorMessage.isRequire),
                validator.isAccents('#adminRegister_password', translation.errorMessage.isAccents),
                validator.minLength('#adminRegister_password', translation.errorMessage.minLength, 6),
                validator.maxLength('#adminRegister_password', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#adminRegister_password', '#form_adminRegister'),

                validator.isRequire('#adminRegister_rePassword', translation.errorMessage.isRequire),
                validator.isConfirm('#adminRegister_rePassword', translation.errorMessage.isConfirm, '#adminRegister_password'),
                validator.removeSpace('#adminRegister_rePassword', '#form_adminRegister'),

                validator.isRequire('#adminRegister_avatar', translation.errorMessage.isRequire),
                validator.isFile('#adminRegister_avatar', translation.errorMessage.isFile, /\.(jpg|jpeg|png|gif)$/),
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
                        setEyePassword(false)
                        setEyeRePassword(false)
                        setUserPosition('NO')
                        setUserDepartment('US')
                        Helper.clearInputData(inputElements, '.parentInput', '.error_message')
                    }
                }
            })
    }
    return (
        <div className='background_linear container_adminRegister container_form'>
            <form id='form_adminRegister' className='form_content'>
                <div className='adminRegister_assist'>
                    <Link className='return_homePage' to='/'>
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <h2 className='form_title'>{translation.register}</h2>
                    <div className='change_language adminRegister_language'>
                        <span className={(state.language === 'vi') ? 'active' : ''}
                            onClick={() => dispatch(setLanguage('VI'))}>VN</span>/
                        <span className={(state.language === 'en') ? 'active' : ''}
                            onClick={() => dispatch(setLanguage('EN'))}>EN</span>
                    </div>
                </div>
                <div className='grid_row'>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='text' className='animate_input reset_input' id='adminRegister_fullname' name='fullName' />
                            <label className='common_label' htmlFor='adminRegister_fullname'>{translation.fullname}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='number' pattern='[0-9]*' inputMode='numeric'
                                className='animate_input reset_input' id='adminRegister_phone' name='phoneNumber' />
                            <label className='common_label' htmlFor='adminRegister_phone'>{translation.phoneNumber}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='text' className='animate_input reset_input' id='adminRegister_email' name='email' />
                            <label className='common_label' htmlFor='adminRegister_email'>Email</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12  parentInput container_radio'>
                        <div className='animate_input container_gender'>
                            {genders && genders.map((item, index) => {
                                return (
                                    <div className='col_4_12' key={index}>
                                        <input type='radio' id={`adminRegister_gender_${item.valueEn}`} className='item_gender'
                                            value={item.keyMap} name='gender' />
                                        <label htmlFor={`adminRegister_gender_${item.valueEn}`}>
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
                            <select className="form-select animate_input form_select adminRegister_position has_data"
                                name='position' value={userPosition} onChange={(e) => setUserPosition(e.target.value)}>
                                {positions && positions.map((position, index) => {
                                    return (
                                        <option value={position.keyMap} key={index}>
                                            {(state.language === 'vi') ? position.valueVi : position.valueEn}</option>
                                    )
                                })}
                            </select>
                            <label className='common_label'>{translation.position}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input reset_input parentInput'>
                            <select className="form-select animate_input form_select adminRegister_department has_data"
                                name='department' value={userDepartment} onChange={(e) => setUserDepartment(e.target.value)}>
                                {departments && departments.map((department, index) => {
                                    return (
                                        <option value={department.keyMap} key={index}>
                                            {(state.language === 'vi') ? department.valueVi : department.valueEn}</option>
                                    )
                                })}
                            </select>
                            <label className='common_label'>{translation.department}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input reset_input parentInput'>
                            <input type='text' className='animate_input reset_input' id='adminRegister_usename' name='useName' />
                            <label className='common_label' htmlFor='adminRegister_usename'>{translation.useName}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input password_eye parentInput'>
                            <input type={eyePassword ? 'text' : 'password'} className='animate_input reset_input' id='adminRegister_password' name='password' />
                            <label className='common_label' htmlFor='adminRegister_password'>{translation.password}</label>
                            <i className={(eyePassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setEyePassword(!eyePassword)}></i>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input password_eye parentInput'>
                            <input type={eyeRePassword ? 'text' : 'password'} className='animate_input reset_input' id='adminRegister_rePassword' />
                            <label className='common_label' htmlFor='adminRegister_rePassword'>{translation.rePassword}</label>
                            <i className={(eyeRePassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setEyeRePassword(!eyeRePassword)}></i>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput item_avatar'>
                            <input type='file' className='animate_input reset_input input_avatar' id='adminRegister_avatar'
                                name='avatar' onChange={handleAvatar} />
                            <label className='common_label' htmlFor='adminRegister_avatar'>{translation.avatar}</label>
                            <p className='error_message'></p>
                            {(avatar) ? <div className='preview_image img-fluid'
                                style={{ backgroundImage: `url(${avatar.preview})` }}></div> : ''}
                        </div>
                    </div>
                </div>
                <div className='parentSubmit'>
                    <p className='error_message' ref={submitMessage} style={{ textAlign: 'center' }}></p>
                    <button className='reset_button button_btn adminRegister_submit'>{translation.register}</button>
                </div>
                <div className='divide_option'>
                    <div className='divide'></div>
                    <p>{translation.or}</p>
                    <div className='divide'></div>
                </div>
                <div className='reset_a adminRegister_link button_btn background_linear' onClick={handleGoBack}>{translation.goBack}</div>
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
                                <Link type="button" className="btn btn-primary reset_a" style={{ fontSize: '1.3rem' }}
                                    to='/login' onClick={handleCloseModal}>{translation.toLogin}</Link>
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
export default AdminRegister