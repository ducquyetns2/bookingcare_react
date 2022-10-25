import './manageHospital.scss'
import { Context } from '~/store/Provider'
import { useContext, useEffect, useLayoutEffect, useState, useRef } from 'react'
import Helper from '~/services/Helper'
import NavigateAssist from '~/components/adminNavigate/NavigateAssist'
import Select from 'react-select'
import validator from '~/services/validator'
import { ToastContainer, toast } from 'react-toastify'

function ManageHospital() {
    const [state] = useContext(Context)
    let translation = Helper.translate(state.language, 'admin').hospitalInfor
    let errorMessage = Helper.translate(state.language, 'formLog').errorMessage
    const [hospitals, setHospitals] = useState()
    const [hospitalOptions, setHospitalOptions] = useState()
    const [change, setChange] = useState(false)
    // Define selected
    const initInfor = {
        hospitalKey: '',
        imageFile: undefined,
        imagePath: '',
        introVi: '',
        introEn: ''
    }
    const [hospitalInfor, setHospitalInfor] = useState(initInfor)
    const backupData = useRef()
    // Define element parent
    const submitParent = useRef()
    const hospitalParent = useRef()
    const imageInput = useRef()
    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/define/getClinicName').then(response => response.json())
            .then(result => {
                setHospitals(result.data)
            })
    }, [])
    useEffect(() => {
        hospitals && setHospitalOptions(Helper.createSelectOptions(hospitals, state.language, 'define'))
    }, [hospitals, state.language])
    useEffect(() => {
        if (hospitalInfor.hospitalKey) {
            fetch(`http://localhost:8080/api/doctor/getHospitalInfor/${hospitalInfor.hospitalKey}`).then(response => response.json())
                .then(result => {
                    let infor = result.data
                    imageInput.current.value = ''
                    if (infor) {
                        setHospitalInfor(infor)
                        backupData.current = infor
                    } else {
                        setHospitalInfor({
                            ...initInfor,
                            hospitalKey: hospitalInfor.hospitalKey
                        })
                        backupData.current = {
                            ...initInfor,
                            hospitalKey: hospitalInfor.hospitalKey
                        }
                    }
                })
        }
    }, [hospitalInfor.hospitalKey])
    useEffect(() => {
        if (hospitalInfor.imagePath) {
            submitParent.current.style = 'margin-top: 50px'
        } else {
            submitParent.current.style = 'margin-top: 0'
        }
    }, [hospitalInfor.imagePath])
    useEffect(() => {
        if (change) {
            validator({
                form: '#form_hospital_detail',
                errorSelector: '.error_message',
                parentInput: '.parentInput',
                submit: '.save_hospital_btn',
                parentSubmit: '.parentSubmit',
                handleSubmit,
                extraValidate: extraValidate,
                rules: [
                    validator.alwaysValid('#manageHospital_introVi'),
                    validator.isAccents('#manageHospital_introEn', errorMessage.isAccents),
                    (hospitalInfor.imagePath) ? validator.alwaysValid('#manageHospital_avatar')
                        : (validator.isRequire('#manageHospital_avatar', errorMessage.isRequire))
                ]
            })
        }
        return () => {
            hospitalInfor.imageFile && URL.revokeObjectURL(hospitalInfor.imagePath)
        }
    }, [state.language, change, hospitalInfor])
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
        setHospitalInfor({
            ...hospitalInfor,
            imageFile: inputAvatar,
            imagePath: preview || hospitalInfor.imagePath
        })
        e.target.files = undefined
    }
    const handleChangeInfor = () => {
        customValidate(hospitalInfor.hospitalKey, hospitalParent.current)
        hospitalInfor.hospitalKey && setChange(true)
    }
    const extraValidate = () => {
        customValidate(hospitalInfor.hospitalKey, hospitalParent.current)
        if (hospitalInfor.hospitalKey) {
            return true
        }
        return false
    }
    const handleBlur = (value, parentInput) => {
        customValidate(value, parentInput)
    }
    const handleChange = (value, inputName, parentInput, isValidate) => {
        setHospitalInfor({
            ...hospitalInfor,
            [inputName]: value
        })
        if (isValidate) {
            customValidate(value, parentInput)
        }
    }
    const handleSubmit = (formValues) => {
        let formData = new FormData()
        let formFields = Object.keys(hospitalInfor)
        for (var i = 0; i < formFields.length; i++) {
            if (!hospitalInfor[formFields[i]]) {
                continue
            }
            formData.append(formFields[i], hospitalInfor[formFields[i]])
        }
        fetch('http://localhost:8080/api/doctor/createHospitalInfor', {
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
        setHospitalInfor(backupData.current)
        setChange(false)
    }
    return (
        <div className='manage_hospital'>
            <NavigateAssist title={translation.moreInfor} />
            <div className='container_hospital admin_common_padding'>
                <div className='hospital_select parentInput' ref={hospitalParent}>
                    <Select options={hospitalOptions} onBlur={() => handleBlur(hospitalInfor.hospitalKey, hospitalParent.current)}
                        value={hospitalOptions && hospitalInfor.hospitalKey &&
                            hospitalOptions.find((item) => item.value === hospitalInfor.hospitalKey)}
                        onChange={(e) => handleChange(e.value, 'hospitalKey', hospitalParent.current, true)}
                        className='z_index_higher' placeholder={translation.chooseHospital}
                        isDisabled={(change) ? true : false} />
                    <p className='error_message'></p>
                </div>
                {(!change) && <div className='btn btn-primary admin_change_btn' onClick={handleChangeInfor}>{translation.change}</div>}
                <form id='form_hospital_detail'>
                    <div className='grid_row'>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageHospital_introVi'
                                    onChange={(e) => handleChange(e.target.value, 'introVi')}
                                    className={(hospitalInfor.introVi) ? 'animate_input reset_input common_area has_data'
                                        : 'animate_input reset_input common_area'}
                                    name='introVi' disabled={(change ? false : true)}
                                    value={hospitalInfor.introVi} />
                                <label className='common_label' htmlFor='manageHospital_introVi'>{translation.introVi}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageHospital_introEn'
                                    onChange={(e) => handleChange(e.target.value, 'introEn')}
                                    className={(hospitalInfor.introEn) ? 'animate_input reset_input common_area has_data'
                                        : 'animate_input reset_input common_area'}
                                    name='introEn' disabled={(change ? false : true)}
                                    value={hospitalInfor.introEn} />
                                <label className='common_label' htmlFor='manageHospital_introEn'>{translation.introEn}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput item_avatar'>
                                <input type='file' className='animate_input reset_input input_avatar' id='manageHospital_avatar'
                                    name='hospitalAvatar' onChange={handleAvatar}
                                    disabled={(change ? false : true)} ref={imageInput}
                                />
                                <label className='common_label' htmlFor='manageHospital_avatar'>{translation.image}</label>
                                <p className='error_message'></p>
                                {(hospitalInfor.imagePath) ? <div className='preview_image img-fluid'
                                    style={{ backgroundImage: `url(${hospitalInfor.imagePath})` }}></div> : ''}
                            </div>
                        </div>
                    </div>
                    <div className='parentSubmit' ref={submitParent}>
                        <p className='error_message' style={{ textAlign: 'center' }}></p>
                        {change && <button className='reset_button button_btn admin_save_btn save_hospital_btn'>{translation.save}</button>}
                        {change && <button className='reset_button button_btn admin_cancel_btn cancel_hospital_btn'
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
export default ManageHospital