import './manageHandbook.scss'
import { Context } from '~/store/Provider'
import { useContext, useEffect, useLayoutEffect, useState, useRef } from 'react'
import Helper from '~/services/Helper'
import NavigateAssist from '~/components/adminNavigate/NavigateAssist'
import Select from 'react-select'
import validator from '~/services/validator'
import { ToastContainer, toast } from 'react-toastify'

function ManageHandbook() {
    const [state] = useContext(Context)
    let translation = Helper.translate(state.language, 'admin').handbookInfor
    let errorMessage = Helper.translate(state.language, 'formLog').errorMessage
    const [handbooks, setHandbooks] = useState()
    const [handbookOptions, setHandbookOptions] = useState()
    const [change, setChange] = useState(false)
    const [create, setCreate] = useState(false)
    // Define selected
    const initInfor = {
        handbookId: '',
        imageFile: undefined,
        imagePath: '',
        titleVi: '',
        titleEn: '',
        contentVi: '',
        contentEn: ''
    }
    const [handbookInfor, setHandbookInfor] = useState(initInfor)
    // Define element parent
    const submitParent = useRef()
    const handbookParent = useRef()
    const imageInput = useRef()
    const backupData = useRef()
    useLayoutEffect(() => {
        fetch('http://localhost:8080/api/doctor/getAllHandbookInfor').then(response => response.json())
            .then(result => {
                setHandbooks(result.data)
            })
    }, [create])
    useEffect(() => {
        handbooks && setHandbookOptions(Helper.createSelectOptions(handbooks, state.language, 'handbook'))
    }, [handbooks, state.language])
    useEffect(() => {
        if (handbookInfor.handbookId) {
            console.log('doing')
            fetch(`http://localhost:8080/api/doctor/getHandbookInfor/${handbookInfor.handbookId}`).then(response => response.json())
                .then(result => {
                    let infor = result.data
                    imageInput.current.value = ''
                    if (infor) {
                        setHandbookInfor(infor)
                        backupData.current = infor

                    } else {
                        setHandbookInfor({
                            ...initInfor,
                            handbookId: handbookInfor.handbookId
                        })
                        backupData.current = {
                            ...initInfor,
                            handbookId: handbookInfor.handbookId
                        }
                    }
                })
        } else {
            backupData.current = initInfor
        }
    }, [handbookInfor.handbookId])
    useEffect(() => {
        if (handbookInfor.imagePath) {
            submitParent.current.style = 'margin-top: 50px'
        } else {
            submitParent.current.style = 'margin-top: 0'
        }
    }, [handbookInfor.imagePath])
    useEffect(() => {
        if (change || create) {
            validator({
                form: '#form_handbook_detail',
                errorSelector: '.error_message',
                parentInput: '.parentInput',
                submit: (change) ? '.save_handbook_btn' : '.create_handbook_btn',
                parentSubmit: '.parentSubmit',
                handleSubmit,
                extraValidate: change && extraValidate,
                rules: [
                    validator.isRequire('#manageHandbook_titleVi', errorMessage.isRequire),
                    validator.isRequire('#manageHandbook_titleEn', errorMessage.isRequire),
                    validator.isAccents('#manageHandbook_titleEn', errorMessage.isAccents),

                    validator.isRequire('#manageHandbook_contentVi', errorMessage.isRequire),
                    validator.isRequire('#manageHandbook_contentEn', errorMessage.isRequire),
                    validator.isAccents('#manageHandbook_contentEn', errorMessage.isAccents),
                    (handbookInfor.imagePath) ? validator.alwaysValid('#manageHandbook_avatar')
                        : (validator.isRequire('#manageHandbook_avatar', errorMessage.isRequire))
                ]
            })
        }
        return () => {
            handbookInfor.imageFile && URL.revokeObjectURL(handbookInfor.imagePath)
        }
    }, [state.language, change, create, handbookInfor])
    // Define function validate
    const customValidate = (value, parentInput) => {
        const errorElement = parentInput.querySelector('.error_message')
        if (value) {
            parentInput.classList.remove('unvalid_border')
            errorElement.innerText = ''
        } else {
            parentInput.classList.add('unvalid_border')
            errorElement.innerText = errorMessage.isChoose
        }
    }
    const handleAvatar = (e) => {
        var inputAvatar = e.target.files[0]
        let preview = ''
        if (inputAvatar) {
            preview = URL.createObjectURL(inputAvatar)
        }
        setHandbookInfor({
            ...handbookInfor,
            imageFile: inputAvatar,
            imagePath: preview || handbookInfor.imagePath
        })
        e.target.files = undefined
    }
    const handleChangeInfor = () => {
        customValidate(handbookInfor.handbookId, handbookParent.current)
        handbookInfor.handbookId && setChange(true)
    }
    const handleCreateInfor = () => {
        setCreate(true)
        customValidate(1, handbookParent.current)
        setHandbookInfor(initInfor)
    }
    const extraValidate = () => {
        customValidate(handbookInfor.handbookId, handbookParent.current)
        if (handbookInfor.handbookId) {
            return true
        }
        return false
    }
    const handleChange = (value, inputName, parentInput, isValidate) => {
        setHandbookInfor({
            ...handbookInfor,
            [inputName]: value
        })
        if (isValidate) {
            customValidate(value, parentInput)
        }
    }
    const handleSubmit = (formValues) => {
        let formData = new FormData()
        let formFields = Object.keys(handbookInfor)
        for (var i = 0; i < formFields.length; i++) {
            if (!handbookInfor[formFields[i]]) {
                continue
            }
            formData.append(formFields[i], handbookInfor[formFields[i]])
        }
        fetch('http://localhost:8080/api/doctor/createHandbookInfor', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(result => {
                if (!result.error) {
                    if (create) {
                        setCreate(false)
                        setHandbookInfor({
                            ...handbookInfor,
                            handbookId: result.data.handbookId
                        })
                    }
                    setChange(false)
                    let message = (result.type === 'create') ?
                        translation.createSuccess : translation.editSuccess
                    toast.success(message, {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            })
    }
    console.log(handbookInfor)
    const handleClickCancel = (e) => {
        e.preventDefault()
        setHandbookInfor(backupData.current)
        setChange(false)
        setCreate(false)
    }
    return (
        <div className='manage_handbook'>
            <NavigateAssist title={translation.moreInfor} />
            <div className='container_handbook admin_common_padding'>
                {(!change) && (!create) && <div className='btn btn-primary create_new_option' onClick={handleCreateInfor}>{translation.createNew}</div>}
                <div className='handbook_select parentInput' ref={handbookParent}>
                    <Select options={handbookOptions}
                        value={handbookOptions && handbookInfor.handbookId &&
                            handbookOptions.find((item) => item.value === handbookInfor.handbookId)}
                        onChange={(e) => handleChange(e.value, 'handbookId', handbookParent.current, true)}
                        className='z_index_higher' placeholder={translation.chooseHandbook}
                        isDisabled={(change || create) ? true : false} />
                    <p className='error_message'></p>
                </div>
                {(!change) && (!create) && <div className='btn btn-primary admin_change_btn' onClick={handleChangeInfor}>{translation.change}</div>}
                <form id='form_handbook_detail'>
                    <div className='grid_row'>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageHandbook_titleVi'
                                    onChange={(e) => handleChange(e.target.value, 'titleVi')}
                                    className={(handbookInfor.titleVi) ? 'animate_input reset_input common_area_min has_data'
                                        : 'animate_input reset_input common_area_min'}
                                    name='titleVi' disabled={(change || create) ? false : true}
                                    value={handbookInfor.titleVi} />
                                <label className='common_label' htmlFor='manageHandbook_titleVi'>{translation.titleVi}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageHandbook_titleEn'
                                    onChange={(e) => handleChange(e.target.value, 'titleEn')}
                                    className={(handbookInfor.titleEn) ? 'animate_input reset_input common_area_min has_data'
                                        : 'animate_input reset_input common_area_min'}
                                    name='titleEn' disabled={(change || create) ? false : true}
                                    value={handbookInfor.titleEn} />
                                <label className='common_label' htmlFor='manageHandbook_titleEn'>{translation.titleEn}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageHandbook_contentVi'
                                    onChange={(e) => handleChange(e.target.value, 'contentVi')}
                                    className={(handbookInfor.contentVi) ? 'animate_input reset_input common_area has_data'
                                        : 'animate_input reset_input common_area'}
                                    name='contentVi' disabled={(change || create) ? false : true}
                                    value={handbookInfor.contentVi} />
                                <label className='common_label' htmlFor='manageHandbook_contentVi'>{translation.contentVi}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput'>
                                <textarea id='manageHandbook_contentEn'
                                    onChange={(e) => handleChange(e.target.value, 'contentEn')}
                                    className={(handbookInfor.contentEn) ? 'animate_input reset_input common_area has_data'
                                        : 'animate_input reset_input common_area'}
                                    name='contentEn' disabled={(change || create) ? false : true}
                                    value={handbookInfor.contentEn} />
                                <label className='common_label' htmlFor='manageHandbook_contentEn'>{translation.contentEn}</label>
                                <p className='error_message'></p>
                            </div>
                        </div>
                        <div className='col_6_12'>
                            <div className='item_input parentInput item_avatar'>
                                <input type='file' className='animate_input reset_input input_avatar' id='manageHandbook_avatar'
                                    name='handbookAvatar' onChange={handleAvatar}
                                    disabled={(change || create) ? false : true} ref={imageInput}
                                />
                                <label className='common_label' htmlFor='manageHandbook_avatar'>{translation.image}</label>
                                <p className='error_message'></p>
                                {(handbookInfor.imagePath) ? <div className='preview_image img-fluid'
                                    style={{ backgroundImage: `url(${handbookInfor.imagePath})` }}></div> : ''}
                            </div>
                        </div>
                    </div>
                    <div className='parentSubmit' ref={submitParent}>
                        <p className='error_message' style={{ textAlign: 'center' }}></p>
                        {change && (!create) && <button className='reset_button button_btn admin_save_btn save_handbook_btn'>{translation.save}</button>}
                        {(!change) && create && <button className='reset_button button_btn admin_save_btn create_handbook_btn'>{translation.create}</button>}
                        {(change || create) && <button className='reset_button button_btn admin_cancel_btn cancel_handbook_btn'
                            onClick={handleClickCancel}>{translation.cancel}</button>}
                    </div>
                </form>
            </div>
            <ToastContainer
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}
export default ManageHandbook