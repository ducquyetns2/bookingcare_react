import './bookingModal.scss'
import { useContext, useEffect, useRef } from 'react'
import { Context } from '~/store/Provider'
import validator from '~/services/validator'
import Helper from '~/services/Helper'
import { language } from '~/store/constant'
import { format } from 'date-fns'

function BookingModal({ doctor, doctorInfor, bookedDate, bookedTime, closeModal }) {
    const formattedDate = format(new Date(bookedDate), 'dd/MM/yyyy')
    const [state] = useContext(Context)
    const translation = Helper.translate(state.language, 'detailDoctor')
    var errorFormlog = Helper.translate(state.language, 'formLog')
    // Define element
    const formContainer = useRef()
    const bookingSuccess = useRef()
    useEffect(() => {
        validator({
            form: `.container_booking`,
            parentInput: '.parentInput',
            errorSelector: '.error_message',
            submit: '.booking_submit',
            parentSubmit: '.parentSubmit',
            handleSubmit,
            rules: [
                validator.isRequire(`#examination_reason`, errorFormlog.errorMessage.isRequire)
            ]
        })
    }, [state.language, doctor, bookedDate, bookedTime])
    const handleClearData = () => {
        const enableInputs = formContainer.current.querySelectorAll('input:not([disabled])')
        Helper.clearInputData(enableInputs, '.parentInput', '.error_message')
        bookingSuccess.current.innerText = ''
    }
    const handleSubmit = (formValues, inputElements) => {
        formValues.userId = state.id
        formValues.doctorId = doctor.id
        formValues.bookedDate = formattedDate
        formValues.bookedTimestamp = bookedDate
        formValues.bookedTime = bookedTime.keyMap
        fetch('http://localhost:8080/api/user/createUserSchedule', {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        }).then(response => response.json())
            .then(result => {
                if (!result.error) {
                    bookingSuccess.current.innerText = translation.bookingSuccess
                } else {
                    if (result.isDulicate) {
                        bookingSuccess.current.innerText = translation.dulicateBooking
                    } else {
                        bookingSuccess.current.innerText = translation.exceedBooking
                    }
                }
                Helper.clearInputData(inputElements)
            })
    }

    return (
        <div className="modal fade" id="BookingModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true" onClick={handleClearData}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                {/* Form Booking */}
                <form className="modal-content container_booking" style={{ padding: '0 20px' }}
                    id={`_form_change_password`}>
                    <div className="modal-header">
                        <h3 className="modal-title">{translation.examinationBooking}</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                            aria-label="Close" onClick={handleClearData} ></button>
                    </div>
                    <div className="modal-body" ref={formContainer}>
                        <div className='doctor_infor_modal'>
                            <div className='doctor_avatar col_1_12'>
                                <img src={doctor && doctor.avatarPath} />
                            </div>
                            <div className='doctor_note col_11_12'>
                                <h3>{
                                    doctor && (state.language === language.VIETNAMESE ? doctor.positionData.valueVi : doctor.positionData.valueEn)}
                                    {doctor && `, ${doctor.fullName}`}
                                </h3>
                                <p>{doctorInfor && ((state.language === language.VIETNAMESE) ? doctorInfor.introVi : doctorInfor.introEn)}</p>
                                <p>
                                    <span style={{ fontWeight: '600' }}>{translation.examinationDate}</span>
                                    {formattedDate}
                                </p>
                            </div>
                        </div>
                        <div className='price_time'>
                            <div className='price'>
                                200,000
                                <label>{translation.price}</label>
                            </div>
                            <div className='time'>{bookedTime && ((state.language === language.VIETNAMESE) ?
                                bookedTime.valueVi : bookedTime.valueEn)}
                                <label>{translation.examinationTime}</label>
                            </div>
                        </div>
                        <div className='parentInput'>
                            <input type='text' className='reset_input animate_input'
                                id='examination_reason' name='examinationReason' />
                            <label htmlFor='patient_address' className='common_label'>{translation.examinationReason}</label>
                            <p className='error_message'></p>
                        </div>
                    </div>
                    <div className="modal-footer parentSubmit">
                        <p className='error_message' style={{ marginTop: '0', justifyContent: 'center' }} ref={bookingSuccess}></p>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                            style={{ fontSize: '1.6rem', width: '100px', marginRight: '10px' }}
                            onClick={handleClearData}>{translation.cancel}</button>
                        <button type="submit" className="btn btn-primary booking_submit" style={{ fontSize: '1.6rem', width: '100px' }}>{translation.book}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default BookingModal