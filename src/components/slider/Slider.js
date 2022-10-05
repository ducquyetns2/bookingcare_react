import { useLayoutEffect } from 'react'
import './slider.scss'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
function Slider(props) {
    var data = props.data
    var options = props.options
    var position = 0;
    var index = 1;
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
                    data.images.map((item, index) =>
                        <a key={index} className='reset_a item_content' href='#' >
                            <div>
                                <img src={item.src} alt='img' />
                                <p>{item.description}</p>
                                {
                                    item.department ? <p className='department'>
                                        {item.department}</p> : ''
                                }
                            </div>
                        </a>)
                }
            </div>
        </div>
        <i className="fa-solid fa-chevron-right btn_right btn_slider"
            onClick={() => handleSlider('right')}></i>
    </div>
}
export default Slider