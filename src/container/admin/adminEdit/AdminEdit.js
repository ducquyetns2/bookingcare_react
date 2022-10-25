import './adminEdit.scss'
import { useContext, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import validator from '~/services/validator'
import { setLanguage } from '~/store/actions'
import { useParams } from 'react-router-dom'
import { language, department, position } from '~/store/constant'

function AdminEdit() {
    const navigate = useNavigate()
    var { id } = useParams()
    const [state, dispatch] = useContext(Context)
    var translation = Helper.translate(state.language, 'formLog')
    const [eyePassword, setEyePassword] = useState(false)
    const [eyeRePassword, setEyeRePassword] = useState(false)
    const [avatar, setAvatar] = useState()
    // Save API
    const [genders, setGenders] = useState()
    const [positions, setPositions] = useState()
    const [departments, setDepartments] = useState()
    const [user, setUser] = useState()
    const [userPosition, setUserPosition] = useState(position.NO)
    const [userDepartment, setUserDepartment] = useState(department.USER)
    // Define element
    const submitMessage = useRef()
    const handleGoBack = () => {
        navigate(-1)
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
        // Get Detail User
        fetch(`http://localhost:8080/api/user/getDetailUser/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(result => {
                setUser(result.data)
                setAvatar({
                    preview: result.data.avatarPath
                })
                if (result.data.position) {
                    setUserPosition(result.data.position)
                }
                setUserDepartment(result.data.department)
            })
    }, [])
    useEffect(() => {
        validator({
            form: '#form_adminEdit',
            errorSelector: '.error_message',
            parentInput: '.parentInput',
            submit: '.adminEdit_submit',
            parentSubmit: '.parentSubmit',
            handleSubmit,
            rules: [
                validator.isRequire('#adminEdit_fullname', translation.errorMessage.isRequire),
                validator.maxLength('#adminEdit_fullname', translation.errorMessage.isMaxlength, 50),

                validator.isRequire('#adminEdit_phone', translation.errorMessage.isRequire),
                validator.isNumber('#adminEdit_phone', translation.errorMessage.isNumber),
                validator.maxLength('#adminEdit_phone', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#adminEdit_phone', '#form_adminEdit'),

                validator.isRequire('#adminEdit_email', translation.errorMessage.isRequire),
                validator.isEmail('#adminEdit_email', translation.errorMessage.isEmail),
                validator.maxLength('#adminEdit_email', translation.errorMessage.maxLength, 50),

                validator.isRequire('.item_gender', translation.errorMessage.isRequire),

                validator.isRequire('.adminEdit_position', translation.errorMessage.isRequire),

                validator.isRequire('.adminEdit_department', translation.errorMessage.isRequire),

                validator.isRequire('#adminEdit_usename', translation.errorMessage.isRequire),
                validator.isAccents('#adminEdit_usename', translation.errorMessage.isAccents),
                validator.maxLength('#adminEdit_usename', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#adminEdit_usename', '#form_adminEdit'),

                validator.isRequire('#adminEdit_password', translation.errorMessage.isRequire),
                validator.isAccents('#adminEdit_password', translation.errorMessage.isAccents),
                validator.minLength('#adminEdit_password', translation.errorMessage.minLength, 6),
                validator.maxLength('#adminEdit_password', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#adminEdit_password', '#form_adminEdit'),

                validator.isRequire('#adminEdit_rePassword', translation.errorMessage.isRequire),
                validator.isConfirm('#adminEdit_rePassword', translation.errorMessage.isConfirm, '#adminEdit_password'),
                validator.removeSpace('#adminEdit_rePassword', '#form_adminEdit'),

                validator.isFile('#adminEdit_avatar', translation.errorMessage.isFile, /\.(jpg|jpeg|png|gif)$/),
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
        for (var i = 0; i < formFields.length; i++) {
            if (!formValues[formFields[i]]) {
                continue
            }
            formData.append(formFields[i], formValues[formFields[i]])
        }
        var isChangeUseName = (formValues.useName === user.useName) ? false : true
        formData.append('id', id)
        formData.append('isChangeUseName', isChangeUseName)
        // Send data
        fetch('http://localhost:8080/api/user/editUser', {
            method: 'PUT',
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
                    submitMessage.current.innerText = translation.editSuccess
                    setAvatar()
                    setEyePassword(false)
                    setEyeRePassword(false)
                    setUserPosition(position.NO)
                    setUserDepartment(department.USER)
                    setUser(result.data)
                    Helper.clearInputData(inputElements)
                    toast.success(translation.editSuccess, {
                        position: "bottom-right",
                        autoClose: 2000,
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
        <div className='background_linear container_adminEdit container_form'>
            <form id='form_adminEdit' className='form_content'>
                <div className='adminEdit_assist'>
                    <Link className='return_homePage' to='/'>
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <h2 className='form_title'>{translation.edit}</h2>
                    <div className='change_language adminEdit_language'>
                        <span className={(state.language === language.VIETNAMESE) ? 'active' : ''}
                            onClick={() => dispatch(setLanguage(language.VIETNAMESE))}>VN</span>/
                        <span className={(state.language === language.ENGLISH) ? 'active' : ''}
                            onClick={() => dispatch(setLanguage(language.ENGLISH))}>EN</span>
                    </div>
                </div>
                <div className='grid_row'>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='text' className='animate_input reset_input has_data' id='adminEdit_fullname' name='fullName'
                                defaultValue={user && user.fullName} />
                            <label className='common_label' htmlFor='adminEdit_fullname'>{translation.fullname}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='number' pattern='[0-9]*' inputMode='numeric'
                                className='animate_input reset_input has_data' id='adminEdit_phone' name='phoneNumber' defaultValue={user && user.phoneNumber} />
                            <label className='common_label' htmlFor='adminEdit_phone'>{translation.phoneNumber}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='text' className='animate_input reset_input has_data' id='adminEdit_email' name='email'
                                defaultValue={user && user.email} />
                            <label className='common_label' htmlFor='adminEdit_email'>Email</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12  parentInput container_radio'>
                        <div className='animate_input container_gender'>
                            {genders && genders.map((item, index) => {
                                return (
                                    <div className='col_4_12' key={index}>
                                        <input type='radio' id={`adminEdit_gender_${item.valueEn}`} className='item_gender'
                                            value={item.keyMap} name='gender' defaultChecked={user && (item.keyMap === user.gender)} />
                                        <label htmlFor={`adminEdit_gender_${item.valueEn}`}>
                                            {(state.language === language.VIETNAMESE) ? item.valueVi : item.valueEn}</label>
                                    </div>
                                )
                            })}
                        </div>
                        <label className='common_label'>{translation.gender}</label>
                        <p className='error_message'></p>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input reset_input parentInput'>
                            <select className="form-select animate_input form_select adminEdit_position has_data"
                                name='position' value={userPosition} onChange={(e) => setUserPosition(e.target.value)}>
                                {positions && positions.map((position, index) => {
                                    return (
                                        <option value={position.keyMap} key={index}>
                                            {(state.language === language.VIETNAMESE) ? position.valueVi : position.valueEn}</option>
                                    )
                                })}
                            </select>
                            <label className='common_label'>{translation.position}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input reset_input parentInput'>
                            <select className="form-select animate_input form_select adminEdit_department has_data"
                                name='department' value={userDepartment} onChange={(e) => setUserDepartment(e.target.value)}>
                                {departments && departments.map((department, index) => {
                                    return (
                                        <option value={department.keyMap} key={index}>
                                            {(state.language === language.VIETNAMESE) ? department.valueVi : department.valueEn}</option>
                                    )
                                })}
                            </select>
                            <label className='common_label'>{translation.department}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input reset_input parentInput'>
                            <input type='text' className='animate_input reset_input has_data' id='adminEdit_usename' name='useName'
                                defaultValue={user && user.useName} />
                            <label className='common_label' htmlFor='adminEdit_usename'>{translation.useName}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input password_eye parentInput'>
                            <input type={eyePassword ? 'text' : 'password'} className='animate_input reset_input has_data' id='adminEdit_password' name='password'
                                defaultValue={user && user.password} />
                            <label className='common_label' htmlFor='adminEdit_password'>{translation.password}</label>
                            <i className={(eyePassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setEyePassword(!eyePassword)}></i>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input password_eye parentInput'>
                            <input type={eyeRePassword ? 'text' : 'password'} className='animate_input reset_input has_data' id='adminEdit_rePassword'
                                defaultValue={user && user.password} />
                            <label className='common_label' htmlFor='adminEdit_rePassword'>{translation.rePassword}</label>
                            <i className={(eyeRePassword) ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setEyeRePassword(!eyeRePassword)}></i>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput item_avatar'>
                            <input type='file' className='animate_input reset_input input_avatar' id='adminEdit_avatar'
                                name='avatar' onChange={handleAvatar} />
                            <label className='common_label' htmlFor='adminEdit_avatar'>{translation.avatar}</label>
                            <p className='error_message'></p>
                            {(avatar) ? <div className='preview_image img-fluid'
                                style={{ backgroundImage: `url(${avatar.preview})` }}></div> : ''}
                        </div>
                    </div>
                </div>
                <div className='parentSubmit'>
                    <p className='error_message' ref={submitMessage} style={{ textAlign: 'center' }}></p>
                    <button className='reset_button button_btn adminEdit_submit'>{translation.edit}</button>
                </div>
                <div className='divide_option'>
                    <div className='divide'></div>
                    <p>{translation.or}</p>
                    <div className='divide'></div>
                </div>
                <div className='reset_a adminEdit_link button_btn background_linear' onClick={handleGoBack}>{translation.goBack}</div>
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
export default AdminEdit