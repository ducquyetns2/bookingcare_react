import './detailDoctor.scss'
import { useContext, useLayoutEffect, useEffect, useRef, useState } from 'react'
import { Context } from '~/store/Provider'
import { useParams, useNavigate } from 'react-router-dom'
import Helper from '~/services/Helper'
import { language } from '~/store/constant'
import { format, addDays, startOfDay } from 'date-fns'
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import Select from 'react-select'
import BookingModal from './BookingModal'

function DetailDoctor() {
    var formatter = useRef(new Intl.NumberFormat('en-US', {
        currency: 'USD'
    }))
    const navigate = useNavigate()
    const doctorId = useRef(useParams().id)
    const [doctor, setDoctor] = useState()
    const [state] = useContext(Context)
    const translation = Helper.translate(state.language, 'detailDoctor')
    const [doctorInfor, setDoctorInfor] = useState()
    const [showDetailPrice, setShowDetailPrice] = useState(false)
    const [doctorSchedule, setDoctorSchedule] = useState()
    const [dateOptions, setDateOptions] = useState()
    const [selectedDate, setSelectedDate] = useState(() => {
        let date = startOfDay(new Date())
        let timestamp = new Date(date).getTime()
        return timestamp
    })
    const [selectedTime, setSelectedTime] = useState()
    useLayoutEffect(() => {
        let dates = []
        for (let i = 0; i < 7; i++) {
            let date = startOfDay(addDays(new Date(), i))
            let dateFormat
            if (i === 0) {
                dateFormat = (state.language === language.VIETNAMESE) ?
                    `Hôm Nay ${format(date, 'dd/MM')}` : `Today ${format(date, 'dd/MM')}`
            } else {
                dateFormat = (state.language === language.VIETNAMESE) ?
                    format(date, 'eeee dd/MM', { locale: vi }) : format(date, 'eeee dd/MM', { locale: en })
            }
            let timestamp = new Date(date).getTime()
            dates.push({
                value: timestamp, label: dateFormat
            })
        }
        setDateOptions(dates)
    }, [state.language])
    useLayoutEffect(() => {
        fetch(`http://localhost:8080/api/doctor/getDetailDoctor/${doctorId.current}`).then(response => response.json())
            .then(result => {
                if (!result.error) {
                    setDoctor(result.data)
                }
            })
        fetch(`http://localhost:8080/api/doctor/getDoctorInfor/${doctorId.current}`).then(response => response.json())
            .then(result => {
                if (!result.error) {
                    setDoctorInfor(result.data)
                }
            })
    }, [])
    useEffect(() => {
        if (selectedDate && doctorId.current) {
            fetch(`http://localhost:8080/api/doctor/getDoctorSchedule/?doctorId=${doctorId.current}&timestamp=${selectedDate}`)
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        setDoctorSchedule(result.data)
                    }
                })
        }
    }, [selectedDate])
    const handleClickTime = (item) => {
        if (!state.login) {
            navigate('/login')
        }
        setSelectedTime(item.timeData)
    }
    return <div className='detail_doctor background_divide'>
        <div className='goBack fa-solid fa-arrow-left' onClick={() => navigate(-1)}></div>
        <div className='detail_content'>
            <div className='doctor_introduce'>
                <div className='doctor_avatar col_1_12'>
                    <img src={doctor && doctor.avatarPath} />
                </div>
                <div className='doctor_note col_11_12'>
                    <h3>{
                        doctor && (state.language === language.VIETNAMESE ? doctor.positionData.valueVi : doctor.positionData.valueEn)}
                        {doctor && `, ${doctor.fullName}`}
                    </h3>
                    <p>
                        <span className='sub_title'>{translation.specialty}</span>
                        {doctorInfor && ((state.language === language.VIETNAMESE) ?
                            doctorInfor.specialtyData.valueVi : doctorInfor.specialtyData.valueEn)}</p>
                    <p>
                        <span className='sub_title'>{translation.description}</span>
                        {doctorInfor && ((state.language === language.VIETNAMESE) ? doctorInfor.introVi : doctorInfor.introEn)}</p>
                </div>
            </div>
            <div className='doctor_booking grid_row'>
                <div className='col_6_12 doctor_booking-left'>
                    <div className='title'>
                        <i className="fa-solid fa-calendar-days"></i>
                        {translation.schedule}
                    </div>
                    <div className='date'>
                        <i className="fa-solid fa-arrow-down"></i>
                        <Select options={dateOptions} onChange={(e) => setSelectedDate(e.value)}
                            value={dateOptions && dateOptions.filter(item => item.value === selectedDate)}
                            className='z_index' />
                    </div>
                    <div className='doctor_schedule grid_row'>
                        {doctorSchedule && doctorSchedule.map(item =>
                            (state.login) ?
                                <div className='time_item' key={item.id} data-bs-toggle="modal"
                                    data-bs-target="#BookingModal" onClick={() => handleClickTime(item)}>{(state.language === language.VIETNAMESE) ?
                                        item.timeData.valueVi : item.timeData.valueEn}</div>
                                : <div className='time_item' key={item.id}
                                    onClick={() => handleClickTime(item)}>{(state.language === language.VIETNAMESE) ?
                                        item.timeData.valueVi : item.timeData.valueEn}</div>

                        )}
                        {<BookingModal doctor={doctor} doctorInfor={doctorInfor} bookedDate={selectedDate}
                            bookedTime={selectedTime} />}
                    </div>
                </div>
                <div className='col_6_12 doctor_booking-right'>
                    <div className='doctor_infor'>
                        <h3 className='address'>{translation.address}</h3>
                        <h4 className='clinic_name'>{doctorInfor && ((state.language === language.VIETNAMESE) ?
                            doctorInfor.hospitalData.valueVi : doctorInfor.hospitalData.valueEn)}</h4>
                        <p className='clinic_address'>{doctorInfor && ((state.language === language.VIETNAMESE) ? doctorInfor.clinicAddressVi : doctorInfor.clinicAddressEn)}</p>
                        <div className='doctor_price'>
                            <h3 className='price_title'>{translation.price} :</h3>
                            {(!showDetailPrice) ? <span>
                                <span className='price'>
                                    {doctorInfor && ((state.language === language.VIETNAMESE) ?
                                        formatter.current.format(doctorInfor.priceData.valueVi) :
                                        formatter.current.format(doctorInfor.priceData.valueEn))}
                                    {(state.language === language.VIETNAMESE) ? 'đ' : '$'}
                                </span>
                                <span className='show_detail_btn' onClick={() => setShowDetailPrice(true)}>{translation.showDetail}</span>
                            </span>
                                : <div className='doctor_price_detail'>
                                    <div className='price_detail_header'>
                                        <h3>{translation.price}</h3>
                                        <p>
                                            {doctorInfor && ((state.language === language.VIETNAMESE) ?
                                                formatter.current.format(doctorInfor.priceData.valueVi) :
                                                formatter.current.format(doctorInfor.priceData.valueEn))}
                                            {(state.language === language.VIETNAMESE) ? 'đ' : '$'}
                                        </p>
                                    </div>
                                    <p>{translation.priority}</p>
                                    <p className='price_detail_footer'>
                                        {translation.paymentMethod}
                                        {doctorInfor && ((state.language === language.VIETNAMESE) ? doctorInfor.paymentData.valueVi : doctorInfor.paymentData.valueEn)}
                                    </p>
                                    <p className='hidden_detail_btn' onClick={() => setShowDetailPrice(false)}>{translation.hiddenDetail}</p>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default DetailDoctor