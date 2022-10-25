import { vietnamese, english } from '../store/language'
import { language } from '~/store/constant'

class Helper {
    translate(languageInput, content) {
        switch (languageInput) {
            case language.VIETNAMESE:
                return vietnamese[content]
            case language.ENGLISH:
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
    createSelectOptions(data, language, type) {
        return data.reduce((current, item) => {
            switch (type) {
                case 'user':
                    return [
                        ...current,
                        {
                            value: item.id, label: item.fullName
                        }
                    ]
                case 'handbook':
                    return [
                        ...current,
                        {
                            value: item.handbookId, label: (language === 'vi') ? item.titleVi : item.titleEn
                        }
                    ]
                case 'define':
                    return [
                        ...current,
                        {
                            value: item.keyMap, label: (language === 'vi') ? item.valueVi : item.valueEn
                        }
                    ]
                default:
                    return [
                        ...current,
                        {
                            value: item.id, label: (language === 'vi') ? item.valueVi : item.valueEn
                        }
                    ]
            }
        }, [])
    }
}
export default new Helper()