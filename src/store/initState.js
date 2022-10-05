var storage = localStorage.getItem('state')
storage = JSON.parse(storage)

const initState = {
    language: (storage && storage.language) ? storage.language : 'vi',
    id: (storage && storage.id) ? storage.id : '',
    fullName: (storage && storage.fullName) ? storage.fullName : '',
    phoneNumber: (storage && storage.useName) ? storage.phoneNumber : '',
    email: (storage && storage.useName) ? storage.email : '',
    gender: (storage && storage.useName) ? storage.gender : '',
    useName: (storage && storage.useName) ? storage.useName : '',
    avatarPath: (storage && storage.avatarPath) ? storage.avatarPath : '',
    login: (storage && storage.login) ? storage.login : false
}
export default initState