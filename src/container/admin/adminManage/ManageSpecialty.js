import './manageSpecialty.scss'
import { Context } from '~/store/Provider'
import { useContext, useEffect, useLayoutEffect, useState, useRef } from 'react'
import Helper from '~/services/Helper'
import NavigateAssist from '~/components/adminNavigate/NavigateAssist'
import Select from 'react-select'
import validator from '~/services/validator'
import { ToastContainer, toast } from 'react-toastify'

function ManageSpecialty() {
    const [state] = useContext(Context)
    let translation = Helper.translate(state.language, 'admin').specialtyInfor
    let errorMessage = Helper.translate(state.language, 'formLog').errorMessage
    const [specialties, setSpecialties] = useState()
    const [specialtyOptions, setSpecialtyOptions] = useState()
    const [change, setChange] = useState(false)
    // Define selected
    const initInfor = {
        specialtyKey: '',
        imageFile: undefined,
        imagePath: '',
        introVi: '',
        introEn: ''
    }
    const [specialtyInfor, setSpecialtyInfor] = useState(initInfor)
    const backupData = useRef()
    // Define element parent
    const submitParent = useRef()
    const specialtyParent = useRef()
    const imageInput = useRef()
    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/define/getSpecialty').then(response => response.json())
            .then(result => {
                setSpecialties(result.data)
            })
    }, [])
    useEffect(() => {
        specialties && setSpecialtyOptions(Helper.createSelectOptions(specialties, state.language, 'define'))
    }, [specialties, state.language])
    useEffect(() => {
        if (specialtyInfor.specialtyKey) {
            fetch(`http://localhost:8080/api/doctor/getSpecialtyInfor/${specialtyInfor.specialtyKey}`).then(response => response.json())
                .then(result => {
                    let infor = result.data
                    imageInput.current.value = ''
                    if (infor) {
                        setSpecialtyInfor(infor)
                        backupData.current = infor
                    } else {
                        setSpecialtyInfor({
                            ...initInfor,
                            specialtyKey: specialtyInfor.specialtyKey
                        })
                        backupData.current = {
                            ...initInfor,
                            specialtyKey: specialtyInfor.specialtyKey
                        }
                    }
                })
        }
    }, [specialtyInfor.specialtyKey])
    useEffect(() => {
        if (specialtyInfor.imagePath) {
            submitParent.current.style = 'margin-top: 50px'
        } else {
            submitParent.current.style = 'margin-top: 0'
        }
    }, [specialtyInfor.imagePath])
    useEffect(() => {
        if (change) {
            validator({
                form: '#form_specialty_detail',
                errorSelector: '.error_message',
                parentInput: '.parentInput',
                submit: '.save_specialty_btn',
                parentSubmit: '.parentSubmit',
                handleSubmit,
                extraValidate: extraValidate,
                rules: [
                    validator.alwaysValid('#manageSpecialty_introVi'),
                    validator.isAccents('#manageSpecialty_introEn', errorMessage.isAccents),
                    (specialtyInfor.imagePath) ? validator.alwaysValid('#manageSpecialty_avatar')
                        : (validator.isRequire('#manageSpecialty_avatar', errorMessage.isRequire))
                ]
            })
        }
        return () => {
            specialtyInfor.imageFile && URL.revokeObjectURL(specialtyInfor.imagePath)
        }
    }, [state.language, change, specialtyInfor])
    // Define function validate
    const customValidate = (value, parentInput) => {
        const errorElement = parentInput.querySelector('.error_message')
        if (value) {
            parentInput.classList.remove('unvalid_border')
            errorElement.innerText = ''
        } else {
            parentInput.classList.add('unvalid_border')
            errorElement.innerText = errorMessage.isChoose
        }
    }
    const handleAvatar = (e) => {
        var inputAvatar = e.target.files[0]
        let preview = ''
        if (inputAvatar) {
            preview = URL.createObjectURL(inputAvatar)
        }
        setSpecialtyInfor({
            ...specialtyInfor,
            imageFile: inputAvatar,
            imagePath: preview || specialtyInfor.imagePath
        })
        e.target.files = undefined
    }
    const handleChangeInfor = () => {
        customValidate(specialtyInfor.specialtyKey, specialtyParent.current)
        specialtyInfor.specialtyKey && setChange(true)
    }
    const extraValidate = () => {
        customValidate(specialtyInfor.specialtyKey, specialtyParent.current)
        if (specialtyInfor.specialtyKey) {
            return true
        }
        return false
    }
    const handleBlur = (value, parentInput) => {
        customValidate(value, parentInput)
    }
    const handleChange = (value, inputName, parentInput, isValidate) => {
        setSpecialtyInfor({
            ...specialtyInfor,
            [inputName]: value
        })
        if (isValidate) {
            customValidate(value, parentInput)
        }
    }
    const handleSubmit = (formValues) => {
        let formData = new FormData()
        let formFields = Object.keys(specialtyInfor)
        for (var i = 0; i < formFields.length; i++) {
            if (!specialtyInfor[formFields[i]]) {
                continue
            }
            formData.append(formFields[i], specialtyInfor[formFields[i]])
        }
        fetch('http://localhost:8080/api/doctor/createSpecialtyInfor', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(result => {
                if (!result.error) {
                    setChange(false)
                    let message = (result.type === 'create') ? translation.createSuccess : translation.editSuccess
                    toast.success(message, {
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
    const handleClickCancel = (e) => {
        e.preventDefault()
        setSpecialtyInfor(backupData.current)
        setChange(false)
    }
    return (
        <div className='manage_specialty'>
            <NavigateAssist title={translation.moreInfor} />
            <div className='container_specialty admin_common_padding'>
                <div className='specialty_select parentInput' ref={specialtyParent}>
                    <Select options={specialtyOptions} onBlur={() => handleBlur(specialtyInfor.specialtyKey, specialtyParent.current)}
                        value={specialtyOptions && specialtyInfor.specialtyKey &&
                            specialtyOptions.find((item) => item.value === specialtyInfor.specialtyKey)}
                        onChange={(e) => handleChange(e.value, 'specialtyKey', specialtyParent.current, true)}
                        className='z_index_higher' placeholder={translation.chooseSpecialty}
                        isDisabled={(change) ? true : false} />
                    <p className='error_message'></p>
                </div>
                {(!change) && <div className='btn btn-primary admin_change_btn' onClick={handleChangeInfor}>{translation.change}</div>}
                <form id='form_specialty_detail'>
                    <div className='grid_row'>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageSpecialty_introVi'
                                    onChange={(e) => handleChange(e.target.value, 'introVi')}
                                    className={(specialtyInfor.introVi) ? 'animate_input reset_input common_area has_data'
                                        : 'animate_input reset_input common_area'}
                                    name='introVi' disabled={(change ? false : true)}
                                    value={specialtyInfor.introVi} />
                                <label className='common_label' htmlFor='manageSpecialty_introVi'>{translation.introVi}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageSpecialty_introEn'
                                    onChange={(e) => handleChange(e.target.value, 'introEn')}
                                    className={(specialtyInfor.introEn) ? 'animate_input reset_input common_area has_data'
                                        : 'animate_input reset_input common_area'}
                                    name='introEn' disabled={(change ? false : true)}
                                    value={specialtyInfor.introEn} />
                                <label className='common_label' htmlFor='manageSpecialty_introEn'>{translation.introEn}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput item_avatar'>
                                <input type='file' className='animate_input reset_input input_avatar' id='manageSpecialty_avatar'
                                    name='specialtyAvatar' onChange={handleAvatar}
                                    disabled={(change ? false : true)} ref={imageInput}
                                />
                                <label className='common_label' htmlFor='manageSpecialty_avatar'>{translation.image}</label>
                                <p className='error_message'></p>
                                {(specialtyInfor.imagePath) ? <div className='preview_image img-fluid'
                                    style={{ backgroundImage: `url(${specialtyInfor.imagePath})` }}></div> : ''}
                            </div>
                        </div>
                    </div>
                    <div className='parentSubmit' ref={submitParent}>
                        <p className='error_message' style={{ textAlign: 'center' }}></p>
                        {change && <button className='reset_button button_btn admin_save_btn save_specialty_btn'>{translation.save}</button>}
                        {change && <button className='reset_button button_btn admin_cancel_btn cancel_specialty_btn'
                            onClick={handleClickCancel}>{translation.cancel}</button>}
                    </div>
                </form>
            </div>
            <ToastContainer
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
export default ManageSpecialty