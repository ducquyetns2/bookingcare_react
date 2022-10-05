import './handbook.scss'
import { useContext } from 'react'
import { Context } from '~/store/Provider'
import Slider from '~/components/slider/Slider'
import bookHong from '~/assets/images/cam-nang-nam.png'
import bookNam from '~/assets/images/cam-nang-hong.png'
import Helper from '~/services/Helper'

let handBook = [
    {
        src: bookNam,
        description: 'Bắn laser trị nám bao nhiêu tiền? Bảng giá tại 5 địa chỉ uy tín ở Hà Nội'
    }, {
        src: bookHong,
        description: 'Bạn chưa tìm được bác sĩ thích hợp? Để chúng tôi giới thiệu với bạn 8 bác sĩ Tai Mũi Họng giỏi ở TP HCM'
    }, {
        src: bookNam,
        description: 'Bắn laser trị nám bao nhiêu tiền? Bảng giá tại 5 địa chỉ uy tín ở Hà Nội'
    }, {
        src: bookHong,
        description: 'Bạn chưa tìm được bác sĩ thích hợp? Để chúng tôi giới thiệu với bạn 8 bác sĩ Tai Mũi Họng giỏi ở TP HCM'
    }, {
        src: bookNam,
        description: 'Bắn laser trị nám bao nhiêu tiền? Bảng giá tại 5 địa chỉ uy tín ở Hà Nội'
    }, {
        src: bookHong,
        description: 'Bạn chưa tìm được bác sĩ thích hợp? Để chúng tôi giới thiệu với bạn 8 bác sĩ Tai Mũi Họng giỏi ở TP HCM'
    }, {
        src: bookNam,
        description: 'Bắn laser trị nám bao nhiêu tiền? Bảng giá tại 5 địa chỉ uy tín ở Hà Nội'
    }, {
        src: bookHong,
        description: 'Bạn chưa tìm được bác sĩ thích hợp? Để chúng tôi giới thiệu với bạn 8 bác sĩ Tai Mũi Họng giỏi ở TP HCM'
    }
]
function Handbook() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage')
    translation = translation.content
    var data = {
        title: translation.handbook,
        button: translation.allHandbook,
        images: handBook
    }
    var options = {
        divideItem: true
    }
    return <div className='handbook background_divide content_padding'>
        <Slider column='2' columnScroll='2' id='handbook_slider' data={data} options={options} />
    </div>
}
export default Handbook