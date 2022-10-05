import './specialist.scss'
import { useContext } from 'react'
import { Context } from '~/store/Provider'
import Slider from '~/components/slider/Slider'
import daKhoa from '~/assets/images/tam-ly.jpg'
import tamLy from '~/assets/images/tim-mach.jpg'
import Helper from '~/services/Helper'

let specialist = [
    {
        src: daKhoa,
        description: 'Đa Khoa'
    }, {
        src: tamLy,
        description: 'Tâm Lý Học'
    }, {
        src: daKhoa,
        description: 'Đa Khoa'
    }, {
        src: tamLy,
        description: 'Tâm Lý Học'
    }, {
        src: daKhoa,
        description: 'Đa Khoa'
    }, {
        src: tamLy,
        description: 'Tâm Lý Học'
    }, {
        src: daKhoa,
        description: 'Đa Khoa'
    }, {
        src: tamLy,
        description: 'Tâm Lý Học'
    }, {
        src: daKhoa,
        description: 'Đa Khoa'
    }, {
        src: tamLy,
        description: 'Tâm Lý Học'
    }, {
        src: daKhoa,
        description: 'Đa Khoa'
    }, {
        src: tamLy,
        description: 'Tâm Lý Học'
    }
]
function Specialist() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage')
    translation = translation.content
    var data = {
        title: translation.specialist,
        button: translation.moreDetail,
        images: specialist
    }
    return <div className='specialist content_padding background_divide'>
        <Slider column='5' columnScroll='5' data={data} id='specialist_slider' />
    </div>
}
export default Specialist