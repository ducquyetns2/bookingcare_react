import './facility.scss'
import { useContext } from 'react'
import { Context } from '~/store/Provider'
import Slider from '~/components/slider/Slider'
import saiGon from '~/assets/images/bv-sai-gon.jpg'
import vietDuc from '~/assets/images/bv-viet-duc.jpg'
import Helper from '~/services/Helper'

var facility = [
    {
        src: saiGon,
        description: 'Bệnh viện Sài Gòn'
    }, {
        src: vietDuc,
        description: 'Bệnh viện Việt Đức'
    }, {
        src: saiGon,
        description: 'Bệnh viện Sài Gòn'
    }, {
        src: vietDuc,
        description: 'Bệnh viện Việt Đức'
    }, {
        src: saiGon,
        description: 'Bệnh viện Sài Gòn'
    }, {
        src: vietDuc,
        description: 'Bệnh viện Việt Đức'
    }, {
        src: saiGon,
        description: 'Bệnh viện Sài Gòn'
    }, {
        src: vietDuc,
        description: 'Bệnh viện Việt Đức'
    }, {
        src: saiGon,
        description: 'Bệnh viện Sài Gòn'
    }, {
        src: vietDuc,
        description: 'Bệnh viện Việt Đức'
    }, {
        src: saiGon,
        description: 'Bệnh viện Sài Gòn'
    }, {
        src: vietDuc,
        description: 'Bệnh viện Việt Đức'
    },
]
function Facility() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage')
    translation = translation.content
    var data = {
        title: translation.facility,
        button: translation.search,
        images: facility
    }
    return <div className='medical_facility content_padding'>
        <Slider column='5' columnScroll='5' data={data} id='facility_slider' />
    </div>
}
export default Facility