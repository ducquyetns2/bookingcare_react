function reducer(state, action) {
    var data = action.data
    var newState = {}
    switch (action.type) {
        case 'VI':
            newState = {
                ...state,
                language: 'vi'
            }
            break
        case 'EN':
            newState = {
                ...state,
                language: 'en'
            }
            break
        case 'LOGIN':
            newState = {
                ...state,
                ...data,
                login: true,
            }
            break
        case 'LOGOUT':
            newState = {
                ...state,
                login: false,
                id: '',
                fullName: '',
                useName: '',
                avatarPath: ''
            }
            break
        case 'USER_EDIT':
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