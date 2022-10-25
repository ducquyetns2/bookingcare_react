import './manageDoctor.scss'
import { useContext, useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react'
import Select from 'react-select'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import validator from '~/services/validator'
import NavigateAssist from '~/components/adminNavigate/NavigateAssist'
import { ToastContainer, toast } from 'react-toastify'
import { department } from '~/store/constant'

function ManageDoctor() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'admin').doctorInfor
    var errorMessage = Helper.translate(state.language, 'formLog').errorMessage
    // define State
    const [doctors, setDoctors] = useState()
    const [payments, setPayments] = useState()
    const [provinces, setProvinces] = useState()
    const [prices, setPrices] = useState()
    const [specialties, setSpecialties] = useState()
    const [hospitals, setHospitals] = useState()

    const initInfor = {
        doctorId: (state.department === department.DOCTOR) ? state.id : '',
        introVi: '',
        introEn: '',
        province: '',
        payment: '',
        price: '',
        specialty: '',
        hospital: '',
        clinicAddressVi: '',
        clinicAddressEn: '',
    }
    const [doctorInfor, setDoctorInfor] = useState(initInfor)
    const backupData = useRef()
    const [change, setChange] = useState(false)
    // define options
    const [doctorOptions, setDoctorOptions] = useState()
    const [provinceOptions, setProvinceOptions] = useState()
    const [priceOptions, setPriceOptions] = useState()
    const [paymentOptions, setPaymentOptions] = useState()
    const [specialtyOptions, setSpecialtyOptions] = useState()
    const [hospitalOptions, setHospitalOptions] = useState()
    useEffect(() => {
        doctors && setDoctorOptions(Helper.createSelectOptions(doctors, state.language, 'user'))
        provinces && setProvinceOptions(Helper.createSelectOptions(provinces, state.language, 'define'))
        prices && setPriceOptions(Helper.createSelectOptions(prices, state.language, 'define'))
        payments && setPaymentOptions(Helper.createSelectOptions(payments, state.language, 'define'))
        specialties && setSpecialtyOptions(Helper.createSelectOptions(specialties, state.language, 'define'))
        hospitals && setHospitalOptions(Helper.createSelectOptions(hospitals, state.language, 'define'))
    }, [doctors, payments, provinces, prices, specialties, hospitals, state.language])
    // Define element parent
    const doctorParent = useRef()
    const priceParent = useRef()
    const paymentParent = useRef()
    const provinceParent = useRef()
    const specialtyParent = useRef()
    const hospitalParent = useRef()
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
    const handleChange = (value, inputName, parentInput, isValidate) => {
        setDoctorInfor({
            ...doctorInfor,
            [inputName]: value
        })
        if (isValidate) {
            customValidate(value, parentInput)
        }
    }
    const handleBlur = (value, parentInput) => {
        customValidate(value, parentInput)
    }
    const handleChangeInfor = () => {
        customValidate(doctorInfor.doctorId, doctorParent.current)
        doctorInfor.doctorId && setChange(true)
    }
    const extraValidate = () => {
        customValidate(doctorInfor.doctorId, doctorParent.current)
        customValidate(doctorInfor.payment, paymentParent.current)
        customValidate(doctorInfor.price, priceParent.current)
        customValidate(doctorInfor.province, provinceParent.current)
        customValidate(doctorInfor.specialty, specialtyParent.current)
        customValidate(doctorInfor.hospital, hospitalParent.current)
        if (doctorInfor.doctorId && doctorInfor.payment && doctorInfor.price
            && doctorInfor.province && doctorInfor.specialty && doctorInfor.hospital) {
            return true
        } else {
            return false
        }
    }
    const handleSubmit = () => {
        fetch('http://localhost:8080/api/doctor/createDoctorInfor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doctorInfor)
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
    useEffect(() => {
        if (change) {
            validator({
                form: '#form_doctor_detail',
                errorSelector: '.error_message',
                parentInput: '.parentInput',
                submit: '.save_doctor_btn',
                parentSubmit: '.parentSubmit',
                handleSubmit,
                extraValidate: extraValidate,
                rules: [
                    validator.alwaysValid('#manageDoctor_introVi'),
                    validator.isAccents('#manageDoctor_introEn', errorMessage.isAccents),

                    validator.isRequire('#manageDoctor_clinicAddress_vi', errorMessage.isRequire),
                    validator.isRequire('#manageDoctor_clinicAddress_en', errorMessage.isRequire),
                    validator.isAccents('#manageDoctor_clinicAddress_en', errorMessage.isAccents),
                ]
            })
        }
    }, [state.language, change, doctorInfor])
    useEffect(() => {
        const id = doctorInfor.doctorId
        if (id) {
            fetch(`http://localhost:8080/api/doctor/getDoctorInfor/${id}`).then(response => response.json())
                .then(result => {
                    let infor = result.data
                    if (infor) {
                        setDoctorInfor(infor)
                        backupData.current = infor
                    } else {
                        setDoctorInfor({
                            ...initInfor,
                            doctorId: id
                        })
                        backupData.current = {
                            ...initInfor,
                            doctorId: doctorInfor.doctorId
                        }
                    }
                })
        }
    }, [doctorInfor.doctorId])
    useLayoutEffect(() => {
        if (state.department === department.ADMIN) {
            fetch('http://localhost:8080/api/doctor/getAllDoctor').then(response => response.json())
                .then(result => {
                    setDoctors(result.data)
                })
        } else {
            let infor = { id: state.id, fullName: state.fullName }
            setDoctors([infor])
        }
        fetch('http://localhost:8080/api/define/getPayment').then(response => response.json())
            .then(result => {
                setPayments(result.data)
            })
        fetch('http://localhost:8080/api/define/getProvince').then(response => response.json())
            .then(result => {
                setProvinces(result.data)
            })
        fetch('http://localhost:8080/api/define/getPrice').then(response => response.json())
            .then(result => {
                setPrices(result.data)
            })
        fetch('http://localhost:8080/api/define/getSpecialty').then(response => response.json())
            .then(result => {
                setSpecialties(result.data)
            })
        fetch('http://localhost:8080/api/define/getHospital').then(response => response.json())
            .then(result => {
                setHospitals(result.data)
            })
    }, [])
    const handleClickCancel = (e) => {
        e.preventDefault()
        setDoctorInfor(backupData.current)
        setChange(false)
    }
    return (
        <div className='manage_doctor'>
            <NavigateAssist title={translation.moreInfor} />
            <div className="container_doctor admin_common_padding">
                <div className='doctor_select parentInput' ref={doctorParent}>
                    <Select options={doctorOptions}
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 7 })
                        }}
                        onBlur={() => handleBlur(doctorInfor.doctorId, doctorParent.current)}
                        onChange={(e) => handleChange(e.value, 'doctorId', doctorParent.current, true)}
                        placeholder={translation.chooseDoctor}
                        isDisabled={(change || state.department === department.DOCTOR) ? true : false}
                        value={doctorOptions && doctorInfor.doctorId && doctorOptions.find((item) => item.value == doctorInfor.doctorId)} />
                    <p className='error_message'></p>
                </div>
                {(!change) && <div className='btn btn-primary admin_change_btn'
                    onClick={handleChangeInfor}>{translation.change}</div>}
                <form id="form_doctor_detail">
                    <div className='grid_row'>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageDoctor_introVi'
                                    className={(doctorInfor.introVi) ? 'animate_input reset_input common_area has_data'
                                        : 'animate_input reset_input common_area'}
                                    name='introVi' disabled={(change ? false : true)}
                                    onChange={(e) => handleChange(e.target.value, 'introVi')} value={doctorInfor.introVi} />
                                <label className='common_label' htmlFor='manageDoctor_introVi'>{translation.introVi}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageDoctor_introEn'
                                    className={(doctorInfor.introEn) ? 'animate_input reset_input common_area has_data'
                                        : 'animate_input reset_input common_area'}
                                    name='introEn' disabled={(change ? false : true)}
                                    value={doctorInfor.introEn} onChange={(e) => handleChange(e.target.value, 'introEn')} />
                                <label className='common_label' htmlFor='manageDoctor_introEn'>{translation.introEn}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_4_12'>
                            <div className='item_input parentInput' ref={priceParent}>
                                <Select options={priceOptions} onBlur={() => handleBlur(doctorInfor.price, priceParent.current)}
                                    onChange={(e) => handleChange(e.value, 'price', priceParent.current, true)}
                                    placeholder={translation.medicalPrice}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 7 })
                                    }}
                                    isDisabled={(change ? false : true)}
                                    value={priceOptions && doctorInfor.price && priceOptions.find((item) => item.value == doctorInfor.price)} />
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_4_12'>
                            <div className='item_input parentInput' ref={paymentParent}>
                                <Select options={paymentOptions} onBlur={() => handleBlur(doctorInfor.payment, paymentParent.current)}
                                    onChange={(e) => handleChange(e.value, 'payment', paymentParent.current, true)}
                                    placeholder={translation.paymentMethod}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 7 })
                                    }}
                                    isDisabled={(change ? false : true)}
                                    value={paymentOptions && doctorInfor.payment && paymentOptions.find((item) => item.value == doctorInfor.payment)} />
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_4_12'>
                            <div className='item_input parentInput' ref={provinceParent}>
                                <Select options={provinceOptions} onBlur={() => handleBlur(doctorInfor.province, provinceParent.current)}
                                    onChange={(e) => handleChange(e.value, 'province', provinceParent.current, true)}
                                    placeholder={translation.province}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 7 })
                                    }}
                                    isDisabled={(change ? false : true)}
                                    value={provinceOptions && doctorInfor.province && provinceOptions.find((item) => item.value == doctorInfor.province)} />
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_2_12'></div>
                        <div className='col_4_12'>
                            <div className='item_input parentInput' ref={specialtyParent}>
                                <Select options={specialtyOptions} onBlur={() => handleBlur(doctorInfor.specialty, specialtyParent.current)}
                                    onChange={(e) => handleChange(e.value, 'specialty', specialtyParent.current, true)}
                                    placeholder={translation.specialty}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 7 })
                                    }}
                                    isDisabled={(change ? false : true)}
                                    value={specialtyOptions && doctorInfor.specialty && specialtyOptions.find((item) => item.value == doctorInfor.specialty)} />
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_4_12'>
                            <div className='item_input parentInput' ref={hospitalParent}>
                                <Select options={hospitalOptions} onBlur={() => handleBlur(doctorInfor.hospital, hospitalParent.current)}
                                    onChange={(e) => handleChange(e.value, 'hospital', hospitalParent.current, true)}
                                    placeholder={translation.hospital}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 7 })
                                    }}
                                    isDisabled={(change ? false : true)}
                                    value={hospitalOptions && doctorInfor.hospital && hospitalOptions.find((item) => item.value == doctorInfor.hospital)} />
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_2_12'></div>
                        <div className='col_2_12'></div>
                        <div className='col_4_12'>
                            <div className='item_input parentInput'>
                                <input type='text' id='manageDoctor_clinicAddress_vi'
                                    className={(doctorInfor.clinicAddressVi) ? 'animate_input reset_input has_data'
                                        : 'animate_input reset_input'}
                                    name='clinicAddressVi' disabled={(change ? false : true)}
                                    onChange={(e) => handleChange(e.target.value, 'clinicAddressVi')} value={doctorInfor.clinicAddressVi} />
                                <label className='common_label' htmlFor='manageDoctor_clinicAddress_vi'>{translation.clinicAddressVi}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_4_12'>
                            <div className='item_input parentInput'>
                                <input type='text' id='manageDoctor_clinicAddress_en'
                                    className={(doctorInfor.clinicAddressEn) ? 'animate_input reset_input has_data'
                                        : 'animate_input reset_input'}
                                    name='clinicAddressEn' disabled={(change ? false : true)}
                                    onChange={(e) => handleChange(e.target.value, 'clinicAddressEn')} value={doctorInfor.clinicAddressEn} />
                                <label className='common_label' htmlFor='manageDoctor_clinicAddress_en'>{translation.clinicAddressEn}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_2_12'></div>
                    </div>
                    <div className='parentSubmit'>
                        <p className='error_message' style={{ textAlign: 'center' }}></p>
                        {change && <button className='reset_button button_btn admin_save_btn save_doctor_btn'>{translation.save}</button>}
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
export default ManageDoctor