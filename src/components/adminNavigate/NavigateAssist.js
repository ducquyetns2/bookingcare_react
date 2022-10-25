import './navigateAssist.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '~/store/Provider'
import { setLanguage } from '~/store/actions'
import Helper from '~/services/Helper'
import { language } from '~/store/constant'

function NavigateAssist({ title }) {
    const navigate = useNavigate()
    const [state, dispatch] = useContext(Context)
    const translation = Helper.translate(state.language, 'admin')
    return (
        <div className='navigate_assist'>
            <div className='assist_button'>
                {/* <Link className='goBack' to='/' title={translation.goBack} onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </Link> */}
                <h2 className='title'>{title}</h2>
                <div className='change_language register_language'>
                    <span className={(state.language === language.VIETNAMESE) ? 'active' : ''}
                        onClick={() => dispatch(setLanguage(language.VIETNAMESE))}>VN</span>/
                    <span className={(state.language === language.ENGLISH) ? 'active' : ''}
                        onClick={() => dispatch(setLanguage(language.ENGLISH))}>EN</span>
                </div>
            </div>
            <div className='assist_create'>
                <Link className='reset_a btn btn-primary create_link' to='/adminRegister'>{translation.createUser}</Link>
            </div>
        </div>
    )
}
export default NavigateAssist