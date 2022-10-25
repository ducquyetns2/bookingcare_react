import './famousDoctor.scss'
import { useContext, useLayoutEffect, useState } from 'react'
import { Context } from '~/store/Provider'
import Slider from '~/components/slider/Slider'
import Helper from '~/services/Helper'

function FamousDoctor() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage').content
    const [doctor, setDoctor] = useState()
    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/doctor/getAllDoctor').then(response => response.json())
            .then(result => {
                setDoctor(result.data)
            })
    }, [])
    var data = {
        type: 'doctor',
        title: translation.famousDoctor,
        button: translation.search,
        recievedData: doctor
    }
    let options = {
        imageCircle: true
    }
    return <div className='famous_doctor background_divide content_padding'>
        <Slider column='5' columnScroll='5' id='doctor' data={data} options={options} />
    </div>
}
export default FamousDoctor