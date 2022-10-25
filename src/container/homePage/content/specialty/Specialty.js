import './specialty.scss'
import { useContext, useState, useLayoutEffect } from 'react'
import { Context } from '~/store/Provider'
import Slider from '~/components/slider/Slider'
import Helper from '~/services/Helper'

function Specialist() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage')
    translation = translation.content
    const [specialties, setSpecialties] = useState()
    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/doctor/getAllSpecialtyInfor').then(response => response.json())
            .then(result => {
                setSpecialties(result.data)
            })
    }, [])
    var data = {
        type: 'specialtyInfor',
        title: translation.specialty,
        button: translation.moreDetail,
        recievedData: specialties
    }
    return <div className='specialty content_padding background_divide'>
        <Slider column='5' columnScroll='5' data={data} id='specialty_slider' />
    </div>
}
export default Specialist