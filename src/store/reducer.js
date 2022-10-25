import { language, actions } from '~/store/constant'

function reducer(state, action) {
    var data = action.data
    var newState = {}
    switch (action.type) {
        case language.VIETNAMESE:
            newState = {
                ...state,
                language: language.VIETNAMESE
            }
            break
        case language.ENGLISH:
            newState = {
                ...state,
                language: language.ENGLISH
            }
            break
        case actions.LOGIN:
            newState = {
                ...state,
                ...data,
                login: true,
            }
            break
        case actions.LOGOUT:
            newState = {
                ...state,
                login: false,
                id: '',
                fullName: '',
                phoneNumber: '',
                email: '',
                gender: '',
                useName: '',
                avatarPath: '',
                department: ''
            }
            break
        case actions.USER_EDIT:
            newState = {
                ...state,
                ...data
            }
            break
        default:
            newState = {
                ...state
            }
    }
    localStorage.setItem('state', JSON.stringify(newState))
    return newState
}
export default reducer