import Specialty from './specialty/Specialty'
import Facility from './facility/Facility'
import FamousDoctor from './famousDoctor/FamousDoctor'
import HandBook from './handbook/Hanbook'

function Content() {
    return <div className='content'>
        <Specialty />
        <Facility />
        <FamousDoctor />
        <HandBook />
    </div>
}
export default Content