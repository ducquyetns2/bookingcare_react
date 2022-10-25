import accents from 'remove-accents'
import Helper from './Helper'

function validator(options) {
    const form = document.querySelector(options.form)
    const $ = form.querySelector.bind(form)
    const $$ = form.querySelectorAll.bind(form)
    const submit = $(options.submit)
    var message
    const validate = (input, inputTest) => {
        var parent = Helper.getParent(input, options.parentInput)
        var errorElement = parent.querySelector(options.errorSelector)
        for (var i = 0; i < inputTest.length; i++) {
            switch (input.type) {
                case 'radio':
                    var checked = $(`input[name=${input.name}]:checked`)
                    message = inputTest[i](checked)
                    break
                case 'file':
                    var value = input.files[0] && input.files[0].name
                    message = inputTest[i](value)
                    break
                default:
                    message = inputTest[i](input.value && input.value.trim())
            }
            if (message) break
        }
        if (message) {
            parent.classList.add('unvalid_input')
        }
        else {
            parent.classList.remove('unvalid_input')
        }
        errorElement.innerText = message
        return message
    }
    const inputTests = {}
    options.rules.forEach(rule => {
        var inputElements = $$(rule.input)
        if (Array.isArray(inputTests[rule.input])) {
            inputTests[rule.input].push(rule.test)
        }
        else {
            inputTests[rule.input] = [rule.test]
        }
        // Handle event
        inputElements.forEach(inputElement => {
            inputElement.onblur = () => {
                validate(inputElement, inputTests[rule.input])
            }
            inputElement.oninput = () => {
                switch (inputElement.type) {
                    case 'radio':
                        break
                    default:
                        if (inputElement.value) {
                            inputElement.classList.add('has_data')
                        }
                        else {
                            inputElement.classList.remove('has_data')
                        }
                }
                var parent = Helper.getParent(inputElement, options.parentInput)
                var errorElement = parent.querySelector(options.errorSelector)
                errorElement.innerText = ''
                parent.classList.remove('unvalid_input')
                // Reset submit message
                var submitParent = Helper.getParent(submit, options.parentSubmit)
                var errorSubmit = submitParent.querySelector(options.errorSelector)
                errorSubmit.innerText = ''
            }
        })
    })
    // Handle Submit
    submit.onclick = (e) => {
        e.preventDefault()
        let isValid = true
        options.rules.forEach(rule => {
            var inputElement = $(rule.input)
            message = validate(inputElement, inputTests[rule.input])
            if (message) {
                isValid = false
            }
        })
        if (options.extraValidate) {
            isValid = options.extraValidate() && isValid
        }
        if (isValid) {
            var enableInputs = $$(`[name]:not([disabled])`)
            var formValues = [...enableInputs].reduce((currentValue, input) => {
                let value
                switch (input.type) {
                    case 'radio':
                        value = $(`input[name=${input.name}]:checked`).value
                        break
                    case 'file':
                        value = input.files[0]
                        break
                    default:
                        value = input.value.trim()
                }
                return {
                    ...currentValue,
                    [input.name]: value
                }
            }, {})
            // Submit Form
            options.handleSubmit(formValues, enableInputs)
        }
    }
}
validator.alwaysValid = (input) => {
    return {
        input,
        test: () => ''
    }
}
validator.isRequire = (input, message) => {
    return {
        input,
        test: value => {
            return (value) ? '' : message
        }
    }
}
validator.isEmail = (input, message) => {
    return {
        input,
        test: value => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return (value.match(regex)) ? '' : message
        }
    }
}
validator.isNumber = (input, message) => {
    return {
        input,
        test: value => {
            var regex = "^[0-9]*$"
            return (value.match(regex)) ? '' : message
        }
    }
}
validator.minLength = (input, message, length) => {
    return {
        input,
        test: value => {
            return (value.length >= length) ? '' : (message + length)
        }
    }
}
validator.maxLength = (input, message, length) => {
    return {
        input,
        test: value => {
            return (value.length <= length) ? '' : message + length
        }
    }
}
validator.isConfirm = (input, message, confirmSelector) => {
    return {
        input,
        test: (value) => {
            var confirmElement = document.querySelector(confirmSelector)
            return (value === confirmElement.value) ? '' : message
        }
    }
}
validator.isSimilar = (input, message, confirmSelector) => {
    return {
        input,
        test: (value) => {
            var confirmElement = document.querySelector(confirmSelector)
            return (value !== confirmElement.value) ? '' : message
        }
    }
}
validator.isAccents = (input, message) => {
    return {
        input,
        test: (value) => {
            return (accents.has(value)) ? message : ''
        }
    }
}
validator.isFile = (input, message, regex) => {
    return {
        input,
        test: (value) => {
            if (!value) return ''
            return (value.match(regex)) ? '' : message
        }
    }
}
validator.removeSpace = (input, form) => {
    return {
        input,
        test: (value) => {
            var newValue = value.replace(/\s/g, '')
            document.querySelector(`${form} ${input}`).value = newValue
            return ''
        }
    }
}
export default validator