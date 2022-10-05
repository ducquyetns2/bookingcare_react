import './footer.scss'
import { useContext } from 'react'
import { Context } from '~/store/Provider'
import booking from '~/assets/images/booking-care.png'
import Helper from '~/services/Helper'

function Footer() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage')
    translation = translation.footer
    return <div className='footer background_divide content_padding'>
        <div className='footer_image'>
            <img src={booking} alt='img' />
        </div>
        <div className='footer_detail'>
            <h3>{translation.downloadBooking}</h3>
            <p><i className="fa-solid fa-check"></i>
                {translation.bookFaster}</p>
            <p><i className="fa-solid fa-check"></i>
                {translation.getAnnouce}</p>
            <p><i className="fa-solid fa-check"></i>
                {translation.getInstruction}</p>
            <img className='download_image' src='https://bookingcare.vn/assets/icon/google-play-badge.svg' alt='img' />
            <img className='download_image' src='https://bookingcare.vn/assets/icon/app-store-badge-black.svg' alt='img' />
            <a className='footer_detail_link reset_a' href='https://bookingcare.vn/app' target='_blank'>{translation.openLink}:
                <strong> https://bookingcare.vn/app</strong>
            </a>
        </div>
    </div>
}
export default Footer