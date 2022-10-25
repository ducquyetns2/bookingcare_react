import './manageSchedule.scss'
import { Context } from '~/store/Provider'
import { useContext, useState, useRef, useLayoutEffect, useEffect } from 'react'
import Helper from '~/services/Helper'
import NavigateAssist from '~/components/adminNavigate/NavigateAssist'
import DatePicker, { registerLocale } from 'react-datepicker'
import { addDays, format } from 'date-fns'
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { department, language } from '~/store/constant'

function ManageSchedule() {
    // define State
    const [state] = useContext(Context)
    const [doctors, setDoctors] = useState()
    const [times, setTimes] = useState()
    const [changeTime, setChangeTime] = useState(false)
    const [doctorSchedule, setDoctorSchedule] = useState()
    // define options
    const [doctorOptions, setDoctorOptions] = useState()
    // Set language Date
    useLayoutEffect(() => {
        switch (state.language) {
            case language.VIETNAMESE:
                registerLocale(language.VIETNAMESE, vi)
                break
            case language.ENGLISH:
                registerLocale(language.ENGLISH, en)
                break
            default:
                registerLocale(language.VIETNAMESE, vi)
        }
    }, [state.language])
    const translation = Helper.translate(state.language, 'admin').scheduleInfor
    var errorMessage = Helper.translate(state.language, 'formLog').errorMessage
    // define options
    useEffect(() => {
        doctors && setDoctorOptions(Helper.createSelectOptions(doctors, state.language, 'user'))
    }, [doctors])
    // define data
    const initSchedule = {
        doctorId: (state.department === department.DOCTOR) ? state.id : '',
        dateFormat: '',
        timestamp: '',
    }
    const [schedule, setSchedule] = useState(initSchedule)
    const timeParent = useRef()
    // Define element
    const doctorParent = useRef()
    const dateParent = useRef()
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
        fetch('http://localhost:8080/api/define/getTime').then(response => response.json())
            .then(result => {
                result.data.forEach(item => item.isSelected = false)
                setTimes(result.data)
            })
    }, [])
    useEffect(() => {
        if (schedule.doctorId && schedule.timestamp) {
            fetch(`http://localhost:8080/api/doctor/getDoctorSchedule/?doctorId=${schedule.doctorId}&timestamp=${schedule.timestamp}`)
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        var data = result.data
                        setDoctorSchedule(data)
                        setTimes(pre => {
                            pre.forEach(time => {
                                var findedTime = data.find((item) => item.time === time.keyMap)
                                time.isSelected = !!findedTime
                            })
                            return pre
                        })
                    }
                })
        }
    }, [schedule.doctorId, schedule.timestamp])
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
    const handleChange = (input, name, parentInput, type) => {
        switch (type) {
            case 'date':
                setSchedule({
                    ...schedule,
                    [name]: input,
                    bookedDate: format(input, 'dd/MM/yyyy'),
                    timestamp: new Date(input).getTime()
                })
                break
            default:
                setSchedule({
                    ...schedule,
                    [name]: input.value
                })
        }
        customValidate(input, parentInput)
    }
    const handleBlur = (value, parentInput) => {
        customValidate(value, parentInput)
    }
    const handleClick = (event, time) => {
        if (changeTime) {
            time.isSelected = !time.isSelected
            let element = event.target
            element.classList.toggle('active')
        }
    }
    const handleChangeTime = () => {
        customValidate(schedule.doctorId, doctorParent.current)
        customValidate(schedule.dateFormat, dateParent.current)
        if (schedule.doctorId && schedule.dateFormat) {
            setChangeTime(true)
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        let selectedTimes = times.filter((item) => item.isSelected === true)
        let { doctorId, bookedDate, timestamp } = schedule
        let transmitedData = []
        if (selectedTimes.length > 0) {
            transmitedData = selectedTimes.reduce((current, item) => {
                return [
                    ...current,
                    {
                        doctorId, bookedDate, timestamp,
                        time: item.keyMap
                    }
                ]
            }, [])
        } else {
            transmitedData = [{ doctorId, timestamp }]
        }
        fetch('http://localhost:8080/api/doctor/createDoctorSchedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transmitedData)
        }).then(response => response.json())
            .then(result => {
                if (!result.error) {
                    if (result.count > 0) {
                        toast.success(translation.createSuccess, {
                            position: "bottom-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                        setChangeTime(false)
                    } else {
                        toast.info(translation.noCreated, {
                            position: "bottom-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                        setChangeTime(false)
                    }
                }
            })
    }
    return (
        <div className='manage_schedule'>
            <NavigateAssist title={translation.examinationPlan} />
            <div className='container_schedule admin_common_padding'>
                <div className='grid_row'>
                    <div className='col_6_12'>
                        <div className='doctor_select parentInput' ref={doctorParent}>
                            <Select options={doctorOptions}
                                value={doctorOptions && schedule.doctorId && doctorOptions.find((item) => item.value == schedule.doctorId)}
                                onBlur={() => handleBlur(schedule.doctorId, doctorParent.current)}
                                isDisabled={(state.department === department.DOCTOR || changeTime) ? true : false}
                                onChange={(value) => handleChange(value, 'doctorId', doctorParent.current, 'default')}
                                className='z_index_higher' placeholder={translation.chooseDoctor} />
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_6_12'>
                        <div className='date_select item_input parentInput' ref={dateParent}>
                            <DatePicker selected={schedule.dateFormat}
                                placeholderText={translation.chooseMedicalDate} dateFormat='dd/MM/yyyy'
                                minDate={new Date()} maxDate={addDays(new Date(), 14)} className='custom_border'
                                locale={(state.language === language.VIETNAMESE) ? language.VIETNAMESE : language.ENGLISH}
                                onBlur={() => handleBlur(schedule.dateFormat, dateParent.current)}
                                onChange={(value) => handleChange(value, 'dateFormat', dateParent.current, 'date')}
                                disabled={(changeTime) ? true : false} />
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className='col_12_12'>
                        <div className='container_time'>
                            {(changeTime) ? <div style={{ marginTop: '35px' }}></div> :
                                <div className="btn btn-primary select_change"
                                    onClick={handleChangeTime}>{translation.change}</div>}
                            <div className='time_select_content parentInput custom_border' ref={timeParent}>
                                {changeTime && <p className='time_select_title'>{translation.chooseTime}</p>}
                                {times && times.map(time =>
                                    <div className={(time.isSelected) ? 'time_item active' : 'time_item'}
                                        key={time.keyMap}
                                        style={changeTime ? { cursor: 'pointer' } : {}}
                                        onClick={(e) => handleClick(e, time)}>
                                        {(!changeTime && time.isSelected) && <span className='time_item_title'>{translation.created}</span>}
                                        {(state.language === language.VIETNAMESE) ? time.valueVi : time.valueEn}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='parentSubmit'>
                    <p className='error_message' style={{ textAlign: 'center' }}></p>
                    {changeTime && <button className='reset_button button_btn save_schedule_btn'
                        onClick={handleSubmit}>{translation.save}</button>}
                </div>
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
export default ManageSchedule