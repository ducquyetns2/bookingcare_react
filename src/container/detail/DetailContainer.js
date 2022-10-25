import Navigation from '~/components/navigate/Navigation'
import Footer from '../homePage/footer/Footer'
import { Outlet } from 'react-router-dom'

function DetailContainer() {
    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
        </>
    )
}
export default DetailContainer 