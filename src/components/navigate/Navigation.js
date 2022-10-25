import './navigation.scss'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '~/store/Provider'
import Helper from '~/services/Helper'
import { setLanguage } from '~/store/actions'
import LoginSuccess from '../loginSucess/LoginSuccess'
import { language } from '~/store/constant'

function Navigation() {
    const [state, dispatch] = useContext(Context)
    const translation = Helper.translate(state.language, 'homePage').header
    return <div className='navigation'>
        <div className='container_navigation'>
            <div className='header_logo'>
                <Link className="home fa-solid fa-house" to='/'></Link>
                <Link className='reset_a' to='/'>
                    <img src='https://bookingcare.vn/assets/icon/bookingcare-2020.svg' alt='img' />
                </Link>
            </div>
            <div className='header_category'>
                <ul className='list_category reset_ul'>
                    <li className='item_category'>
                        <a className='reset_a' href='#'> {translation.specialty}
                            <p>{translation.findDoctor}</p>
                        </a>
                    </li>
                    <li className='item_category'>
                        <a className='reset_a' href='#'>{translation.facility}
                            <p>{translation.selectHospital}</p>
                        </a>
                    </li>
                    <li className='item_category'>
                        <a className='reset_a' href='#'> {translation.doctor}
                            <p>{translation.chooseDoctor}</p>
                        </a>
                    </li>
                    <li className='item_category'>
                        <a className='reset_a' href='#'> {translation.packageCheck}
                            <p>{translation.checkHeath}</p>
                        </a>
                    </li>
                </ul>
            </div>
            <div className='header_button'>
                <div className='header_assist'>
                    <a className='assist'>
                        <i className="fa-solid fa-circle-question"></i>
                        <span>{translation.assist}</span>
                    </a>
                    <div className='change_language'>
                        <span className={(state.language === language.VIETNAMESE) ? 'active' : ''}
                            onClick={() => dispatch(setLanguage(language.VIETNAMESE))}>VN</span>/
                        <span className={(state.language === 'en') ? 'active' : ''}
                            onClick={() => dispatch(setLanguage(language.ENGLISH))}>EN</span>
                    </div>
                </div>
                {(state.login) ? <LoginSuccess formatId='navigate' />
                    :
                    <div className='header_link'>
                        <Link className='btn btn-primary' to='login'>{translation.login}</Link>
                        <Link className="btn btn-success" to='register'>{translation.register}</Link>
                    </div>}
            </div>
        </div>
    </div>
}
export default Navigation