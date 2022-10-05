import { vietnamese, english } from '../store/language'

class Helper {
    translate(language, content) {
        switch (language) {
            case 'vi':
                return vietnamese[content]
            case 'en':
                return english[content]
            default:
                return vietnamese[content]
        }
    }
    getParent(input, parrent) {
        while (input.parentElement) {
            if (input.parentElement.matches(parrent)) {
                return input.parentElement
            }
            input = input.parentElement
        }
    }
    clearInputData(inputElements, parentInput, errorSelector) {
        inputElements.forEach(input => {
            switch (input.type) {
                case 'radio':
                    input.checked = false
                    break;
                default:
                    input.value = ''
            }
            if (parentInput && errorSelector) {
                input.classList.remove('has_data')
                var parent = this.getParent(input, parentInput)
                parent.classList.remove('unvalid_input')
                var errorElement = parent.querySelector(errorSelector)
                errorElement.innerText = ''
            }
        })
    }
}
export default new Helper()