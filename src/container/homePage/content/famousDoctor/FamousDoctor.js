import './famousDoctor.scss'
import { useContext } from 'react'
import { Context } from '~/store/Provider'
import Slider from '~/components/slider/Slider'
import bsHaNoi from '~/assets/images/bs-hanoi.jpg'
import Helper from '~/services/Helper'

let famousDoctor = [
    {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    }, {
        src: bsHaNoi,
        description: 'Thạc sĩ, bác sĩ chuyên khoa Hà Nội',
        department: 'Sức khỏe tinh thần'
    },
]
function FamousDoctor() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage')
    translation = translation.content
    var data = {
        title: translation.famousDoctor,
        button: translation.search,
        images: famousDoctor
    }
    let options = {
        imageCircle: true
    }
    return <div className='famous_doctor background_divide content_padding'>
        <Slider column='5' columnScroll='5' id='doctor' data={data} options={options} />
    </div>
}
export default FamousDoctor