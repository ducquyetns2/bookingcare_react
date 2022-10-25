import { useLayoutEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '~/store/Provider'
import { language } from '~/store/constant'
import './slider.scss'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
function Slider(props) {
    const [state, dispatch] = useContext(Context)
    var data = props.data
    var options = props.options
    var position = 0;
    var index = 1;
    let newData = []
    if (data.recievedData) {
        let recievedData = data.recievedData
        switch (data.type) {
            case 'doctor':
                newData = recievedData.map(item => {
                    return {
                        link: `detailDoctor/${item.id}`,
                        image: item.avatarPath,
                        name: item.fullName,
                        positionData: item.positionData
                    }
                })
                break
            case 'specialtyInfor':
                newData = recievedData.map(item => {
                    return {
                        link: `detailSpecialty/${item.id}`,
                        image: item.imagePath,
                        multiName: item.specialtyName,
                    }
                })
                console.log(newData)
                break
            case 'hospitalInfor':
                newData = recievedData.map(item => {
                    return {
                        link: `detailHospital/${item.id}`,
                        image: item.imagePath,
                        multiName: item.hospitalName,
                    }
                })
                break
            case 'handbookInfor':
                newData = recievedData.map(item => {
                    return {
                        link: `detailHandbook/${item.handbookId}`,
                        image: item.imagePath,
                        multiName: { valueVi: item.titleVi, valueEn: item.titleEn }
                    }
                })
                break
            default:
        }
    }
    // console.log(newData)
    useLayoutEffect(() => {
        let items = $$(`#${props.id} .item_content`)
        items = [...items]
        items.forEach(item => {
            item.classList.add(`col_${props.column}`)
            if (options) {
                if (options.divideItem) {
                    item.querySelector('div').classList.add('divide_item')
                }
                if (options.imageCircle) {
                    item.classList.add('image_circle')
                }
            }
        })
    })
    const handleSlider = (type) => {
        let slider = $(`#${props.id} .slider_content`)
        let btnLeft = $(`#${props.id} .btn_left`)
        let btnRight = $(`#${props.id} .btn_right`)
        let items = $$(`#${props.id} .item_content`)
        items = [...items]
        const itemWidth = items[0].getBoundingClientRect().width
        const widthScroll = itemWidth * props.columnScroll;
        const maxIndex = Math.ceil(items.length / props.columnScroll)
        if (type === 'left') {
            btnRight.classList.remove('hiddenItem')
            if (index == 1) {
                return
            }
            else {
                position += widthScroll
                slider.style.transform = `translateX(${position}px)`
                index--
                if (index == 1) {
                    btnLeft.classList.add('hiddenItem')
                }
            }
        }
        else {
            btnLeft.classList.remove('hiddenItem')
            if (index == maxIndex) {
                index = maxIndex
            }
            else {
                position -= (widthScroll)
                slider.style.transform = `translateX(${position}px)`
                index++
                if (index == maxIndex) {
                    btnRight.classList.add('hiddenItem')
                }
            }
        }
    }
    const handleScrollToTop = () => {
        window.scrollTo(0, 0)
    }
    return <div className='slider' id={props.id}>
        <div className='slider_header'>
            <h2>{data.title}</h2>
            <a href='#'>{data.button}</a>
        </div>
        <i className="fa-solid fa-chevron-left btn_left btn_slider hiddenItem"
            onClick={() => handleSlider('left')}></i>
        <div className='slider_wraper'>
            <div className='slider_content'>
                {
                    newData && newData.map((item, index) =>
                        <Link key={index} className='reset_a item_content' to={item.link}
                            onClick={handleScrollToTop}>
                            <div>
                                <img src={item.image} alt='img' />
                                {item.name && <p>{item.name}</p>}
                                {item.multiName && <p>
                                    {(state.language === language.VIETNAMESE) ?
                                        item.multiName.valueVi : item.multiName.valueEn}
                                </p>}
                                {item.positionData && <p className='position'>
                                    {(state.language === language.VIETNAMESE) ?
                                        item.positionData.valueVi : item.positionData.valueEn}</p>}
                            </div>
                        </Link>)
                }
            </div>
        </div>
        <i className="fa-solid fa-chevron-right btn_right btn_slider"
            onClick={() => handleSlider('right')}></i>
    </div>
}
export default Slider