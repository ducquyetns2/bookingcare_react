import Specialist from './specialist/Specialist'
import Facility from './facility/Facility'
import FamousDoctor from './famousDoctor/FamousDoctor'
import HandBook from './handbook/Hanbook'

function Content() {
    return <div className='content'>
        <Specialist />
        <Facility />
        <FamousDoctor />
        <HandBook />
    </div>
}
export default Content