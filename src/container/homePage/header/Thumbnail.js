import './thumbnail.scss'
import { useContext } from 'react'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'

function Thumbnail() {
    const [state] = useContext(Context)
    var translation = Helper.translate(state.language, 'homePage')
    translation = translation.header
    return <div className='thumbnail'>
        <div className='background_opacity'>
            <div className='header_title'>
                <p>{translation.medical}</p>
                <p>{translation.heathCare}</p>
            </div>
            <div className='header_search'>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input className='search_input' placeholder={translation.findHospital} />
            </div>
            <div className='header_download'>
                <img src='https://bookingcare.vn/assets/icon/google-play-badge.svg' alt='img' />
                <img src='https://bookingcare.vn/assets/icon/app-store-badge-black.svg' alt='img' />
            </div>
            <div className='header_select'>
                <div className='select_item'>
                    <i className="fa-solid fa-hospital"></i>
                    <p>{translation.checkSpecialist}</p>
                </div>
                <div className='select_item'>
                    <i className="fa-solid fa-phone-volume"></i>
                    <p>{translation.checkRemote}</p>
                </div>
                <div className='select_item'>
                    <i className="fa-solid fa-calendar-week"></i>
                    <p>{translation.checkGeneral}</p>
                </div>
                <div className='select_item'>
                    <i className="fa-solid fa-flask-vial"></i>
                    <p>{translation.testMedical}</p>
                </div>
                <div className='select_item'>
                    <i className="fa-solid fa-brain"></i>
                    <p>{translation.metalHealth}</p>
                </div>
                <div className='select_item'>
                    <i className="fa-solid fa-tooth"></i>
                    <p>{translation.checkDetal}</p>
                </div>
                <div className='select_item'>
                    <i className="fa-solid fa-box-open"></i>
                    <p>{translation.packageSurgery}</p>
                </div>
                <div className='select_item'>
                    <i className="fa-brands fa-shopify"></i>
                    <p>{translation.medicalProduct}</p>
                </div>
            </div>
        </div>
    </div>
}
export default Thumbnail