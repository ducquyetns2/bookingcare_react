import './userEdit.scss'
import { useContext, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import validator from '~/services/validator'
import { setLanguage, userEdit } from '~/store/actions'

function UserEdit() {
    const [state, dispatch] = useContext(Context)
    var translation = Helper.translate(state.language, 'formLog')
    const [avatar, setAvatar] = useState({ preview: state.avatarPath })
    // avatar.preview = state.avatarPath
    const [genders, setGenders] = useState()
    const navigate = useNavigate()
    // Define element
    const submitMessage = useRef()
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
        if (!state.login) {
            navigate('/login')
        }
        validator({
            form: '#form_userEdit',
            errorSelector: '.error_message',
            parentInput: '.parentInput',
            submit: '.userEdit_submit',
            parentSubmit: '.parentSubmit',
            handleSubmit,
            rules: [
                validator.isRequire('#userEdit_fullname', translation.errorMessage.isRequire),
                validator.maxLength('#userEdit_fullname', translation.errorMessage.isMaxlength, 50),

                validator.isRequire('#userEdit_phone', translation.errorMessage.isRequire),
                validator.isNumber('#userEdit_phone', translation.errorMessage.isNumber),
                validator.maxLength('#userEdit_phone', translation.errorMessage.maxLength, 20),
                validator.removeSpace('#userEdit_phone', '#form_userEdit'),

                validator.isRequire('#userEdit_email', translation.errorMessage.isRequire),
                validator.isEmail('#userEdit_email', translation.errorMessage.isEmail),
                validator.maxLength('#userEdit_email', translation.errorMessage.maxLength, 50),

                validator.isFile('#userEdit_avatar', translation.errorMessage.isFile, /\.(jpg|jpeg|png|gif)$/),
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
        formData.append('id', state.id)
        console.log([...formData])
        // Send data
        fetch('http://localhost:8080/api/user/editUser', {
            method: 'PUT',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                // Reset Data
                setAvatar()
                Helper.clearInputData(inputElements, '.parentInput', '.error_message')
                submitMessage.current.innerText = translation.editSuccess
                dispatch(userEdit('USER_EDIT', result.data))
                toast.success(translation.editSuccess, {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
    }
    return (
        <div className='background_linear container_userEdit container_form'>
            <form id='form_userEdit' className='form_content'>
                <Link className='return_homePage' to='/'>
                    <i className="fa-solid fa-house"></i>
                </Link>
                <h2 className='form_title'>{translation.edit}</h2>
                <div className='change_language userEdit_language'>
                    <span className={(state.language === 'vi') ? 'active' : ''}
                        onClick={() => dispatch(setLanguage('VI'))}>VN</span>/
                    <span className={(state.language === 'en') ? 'active' : ''}
                        onClick={() => dispatch(setLanguage('EN'))}>EN</span>
                </div>
                <div className='grid_row'>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='text' className='animate_input reset_input has_data' id='userEdit_fullname' name='fullName'
                                defaultValue={state.fullName} />
                            <label className='common_label' htmlFor='userEdit_fullname'>{translation.fullname}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='number' pattern='[0-9]*' inputMode='numeric'
                                className='animate_input reset_input has_data' id='userEdit_phone' name='phoneNumber' defaultValue={state.phoneNumber} />
                            <label className='common_label' htmlFor='userEdit_phone'>{translation.phoneNumber}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput'>
                            <input type='text' className='animate_input reset_input has_data' id='userEdit_email'
                                name='email' defaultValue={state.email} />
                            <label className='common_label' htmlFor='userEdit_email'>Email</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_4_12 container_gender parentInput'>
                        <div className='animate_input container_gender'>
                            {genders && genders.map((item, index) => {
                                return (
                                    <div className='col_4_12' key={index}>
                                        <input type='radio' id={`userEdit_gender_${item.valueEn}`} className='item_gender'
                                            value={item.keyMap} name='gender' defaultChecked={(item.keyMap === state.gender) ? 'true' : ''} />
                                        <label htmlFor={`userEdit_gender_${item.valueEn}`}>
                                            {(state.language === 'vi') ? item.valueVi : item.valueEn}</label>
                                    </div>
                                )
                            })}
                        </div>
                        <p className='error_message'></p>
                    </div>
                    <div className='col_4_12'>
                        <div className='item_input parentInput item_avatar'>
                            <input type='file' className='animate_input reset_input input_avatar' id='userEdit_avatar'
                                name='avatar' onChange={handleAvatar} />
                            <label className='common_label' htmlFor='userEdit_avatar'>{translation.avatar}</label>
                            <p className='error_message'></p>
                            {(avatar) ? <div className='preview_image img-fluid'
                                style={{ backgroundImage: `url(${avatar.preview})` }}></div> : ''}
                        </div>
                    </div>
                </div>
                <div className='parentSubmit'>
                    <p className='error_message' ref={submitMessage} style={{ justifyContent: 'center' }}></p>
                    <button className='reset_button button_btn userEdit_submit'>{translation.edit}</button>
                </div>
                <div className='divide_option'>
                    <div className='divide'></div>
                    <p>{translation.or}</p>
                    <div className='divide'></div>
                </div>
                <div className='button_btn background_linear'
                    onClick={() => navigate(-1)}>{translation.goBack}</div>
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
export default UserEdit