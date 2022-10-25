import './facility.scss'
import { useContext, useState, useLayoutEffect } from 'react'
import { Context } from '~/store/Provider'
import Slider from '~/components/slider/Slider'
import Helper from '~/services/Helper'

function Facility() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage').content
    const [hospitals, setHospitals] = useState()
    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/doctor/getAllHospitalInfor').then(response => response.json())
            .then(result => {
                setHospitals(result.data)
            })
    }, [])
    var data = {
        type: 'hospitalInfor',
        title: translation.facility,
        button: translation.search,
        recievedData: hospitals
    }
    return <div className='medical_facility content_padding'>
        <Slider column='5' columnScroll='5' data={data} id='facility_slider' />
    </div>
}
export default Facility