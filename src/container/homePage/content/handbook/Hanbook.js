import './handbook.scss'
import { useContext, useState, useLayoutEffect } from 'react'
import { Context } from '~/store/Provider'
import Slider from '~/components/slider/Slider'
import Helper from '~/services/Helper'

function Handbook() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage').content
    const [handbooks, setHandbooks] = useState()
    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/doctor/getAllHandbookInfor').then(response => response.json())
            .then(result => {
                setHandbooks(result.data)
            })
    }, [])
    var data = {
        type: 'handbookInfor',
        title: translation.handbook,
        button: translation.allHandbook,
        recievedData: handbooks
    }
    var options = {
        divideItem: true
    }
    return <div className='handbook background_divide content_padding'>
        <Slider column='2' columnScroll='2' id='handbook_slider' data={data} options={options} />
    </div>
}
export default Handbook