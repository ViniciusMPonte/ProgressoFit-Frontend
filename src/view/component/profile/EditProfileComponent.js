import { EditProfileService } from './service/EditProfileService.js'
import { AvatarComponent } from '../AvatarComponent.js'

export class EditProfileComponent {
    constructor(targetTag) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()
        this.componentService = new EditProfileService(this.dom)
        this.originalData = {}
    }

    autoRender() {
        this.targetTag.innerHTML = this.get()
        this.setupEventListeners()
        this.loadUserData()
    }

    async loadUserData() {
        await this.componentService.loadUserProfile()
        this.showAvatarOptions()
        this.setupAvatarOptionsListener()
        this.storeOriginalData()
    }

    setupEventListeners() {
        this.setupEditButtonListener()
        this.setupSaveButtonListener()
        this.setupCancelButtonListener()
    }

    setupEditButtonListener() {
        const editButton = this.dom.getEditButton()
        if (!editButton) return

        editButton.addEventListener('click', () => {
            this.enableEdit()
            this.storeOriginalData()
            const passwordInput = this.dom.getPasswordInput()
            if (passwordInput) passwordInput.value = ''
        })
    }

    setupSaveButtonListener() {
        const saveButton = this.dom.getSaveButton()
        if (!saveButton) return

        saveButton.addEventListener('click', async () => {
            await this.saveProfile()
        })
    }

    setupCancelButtonListener() {
        const cancelButton = this.dom.getCancelButton()
        if (!cancelButton) return

        cancelButton.addEventListener('click', () => {
            this.disableEdit()
            this.restoreOriginalData()
        })
    }

    setupAvatarOptionsListener() {
        const avatarOptionsContainer = this.dom.getAvatarOptions()
        if (!avatarOptionsContainer) return

        const imageOptions = [...avatarOptionsContainer.children]
        const profileImgNameInput = this.dom.getProfileImgNameInput()

        imageOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.swapSelected(imageOptions, option)
                if (profileImgNameInput) {
                    profileImgNameInput.value = option.getAttribute('data-image')
                }
            })
        })
    }

    setupAvatarPreviewObserver() {
        const selectedAvatar = document.getElementById('selected-avatar')
        if (!selectedAvatar) return

        this.updateAvatarPreview(selectedAvatar)
        this.observeAvatarChanges(selectedAvatar)
    }

    updateAvatarPreview(selectedAvatar) {
        const selected = document.querySelector('.image-option.selected img')
        if (selected) {
            selectedAvatar.src = selected.src
        }
    }

    observeAvatarChanges(selectedAvatar) {
        const observer = new MutationObserver(() => {
            this.updateAvatarPreview(selectedAvatar)
        })

        document.querySelectorAll('.image-option').forEach(option => {
            observer.observe(option, {
                attributes: true,
                attributeFilter: ['class'],
            })
        })
    }

    showAvatarOptions() {
        const avatarOptions = this.dom.getAvatarOptions()
        if (!avatarOptions) return

        avatarOptions.innerHTML = new AvatarComponent().getAllAvatarImgOptions()

        const profileImgName = this.dom.getProfileImgNameInput()?.value
        if (profileImgName) {
            this.selectAvatarOptByImgName(profileImgName)
        }

        this.setupAvatarPreviewObserver()
    }

    storeOriginalData() {
        this.originalData = {
            name: this.dom.getNameInput()?.value || '',
            email: this.dom.getEmailInput()?.value || '',
            password: this.dom.getPasswordInput()?.value || '',
            profileImgName: this.dom.getProfileImgNameInput()?.value || '',
        }
    }

    restoreOriginalData() {
        const nameInput = this.dom.getNameInput()
        const emailInput = this.dom.getEmailInput()
        const passwordInput = this.dom.getPasswordInput()
        const profileImgNameInput = this.dom.getProfileImgNameInput()

        if (nameInput) nameInput.value = this.originalData.name
        if (emailInput) emailInput.value = this.originalData.email
        if (passwordInput) passwordInput.value = this.originalData.password
        if (profileImgNameInput) profileImgNameInput.value = this.originalData.profileImgName

        this.selectAvatarOptByImgName(this.originalData.profileImgName)
    }

    enableEdit() {
        this.enableEditForm()
        this.enableEditButtons()
    }

    disableEdit() {
        this.disableEditForm()
        this.disableEditButtons()
    }

    enableEditForm() {
        const avatarOptContainer = this.dom.getAvatarOptions()
        if (avatarOptContainer) {
            avatarOptContainer.classList.add('editing')
        }

        const inputs = [this.dom.getNameInput(), this.dom.getEmailInput(), this.dom.getPasswordInput()]

        inputs.forEach(input => {
            if (!input) return
            input.removeAttribute('readonly')
            input.classList.remove('form-control-plaintext')
            input.classList.add('form-control')
        })
    }

    disableEditForm() {
        const avatarOptContainer = this.dom.getAvatarOptions()
        if (avatarOptContainer) {
            avatarOptContainer.classList.remove('editing')
        }

        const inputs = [this.dom.getNameInput(), this.dom.getEmailInput(), this.dom.getPasswordInput()]

        inputs.forEach(input => {
            if (!input) return
            input.setAttribute('readonly', true)
            input.classList.remove('form-control')
            input.classList.add('form-control-plaintext')
        })
    }

    enableEditButtons() {
        const editButton = this.dom.getEditButton()
        const saveButton = this.dom.getSaveButton()
        const cancelButton = this.dom.getCancelButton()

        if (editButton) editButton.classList.add('d-none')
        if (saveButton) saveButton.classList.remove('d-none')
        if (cancelButton) cancelButton.classList.remove('d-none')
    }

    disableEditButtons() {
        const editButton = this.dom.getEditButton()
        const saveButton = this.dom.getSaveButton()
        const cancelButton = this.dom.getCancelButton()

        if (editButton) editButton.classList.remove('d-none')
        if (saveButton) saveButton.classList.add('d-none')
        if (cancelButton) cancelButton.classList.add('d-none')
    }

    swapSelected(allTags, selectedTag) {
        allTags.forEach(opt => opt.classList.remove('selected'))
        selectedTag.classList.add('selected')
    }

    selectAvatarOptByImgName(profileImgName) {
        const selectedImg = document.querySelector(`.image-option[data-image="${profileImgName}"]`)
        if (!selectedImg) return

        const avatarOptionsContainer = this.dom.getAvatarOptions()
        if (!avatarOptionsContainer) return

        const imageOptions = [...avatarOptionsContainer.children]
        this.swapSelected(imageOptions, selectedImg)
    }

    showLoading(show) {
        const saveButton = this.dom.getSaveButton()
        const loadingDiv = this.dom.getLoadingDiv()

        if (saveButton) {
            saveButton.disabled = show
        }

        if (loadingDiv) {
            if (show) {
                loadingDiv.classList.remove('d-none')
            } else {
                loadingDiv.classList.add('d-none')
            }
        }
    }

    async saveProfile() {
        this.showLoading(true)

        const result = await this.componentService.updateProfile()

        this.showLoading(false)

        if (result.success) {
            this.disableEdit()
            this.storeOriginalData()

            if (this.componentService.callbackForm) {
                this.componentService.callbackForm('Perfil atualizado com sucesso!', 'success')
            }
        } else {
            if (this.componentService.callbackForm) {
                this.componentService.callbackForm(result.message, result.type || 'danger')
            }
        }
    }

    get() {
        return /*html*/ `

            <div class="card-header" style="margin: 0; align-items: center; padding: 20px; font-size: x-large">
                <span class="g-bold"><i class="fa-solid fa-user fa-lg"></i>&nbsp;&nbsp;Meu Perfil</span>
            </div>

            <form id="profileForm" class="p-5">
                <div id="avatar-preview">
                    <img id="selected-avatar" src="" alt="Avatar selecionado">
                </div>

                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#meuModal">
                    Abrir Modal
                </button>

                <div class="form-floating mb-1">
                    <input type="text" class="form-control-plaintext" id="floatingName" readonly />
                    <label class="g-bold" for="floatingName">Nome</label>
                </div>

                <div class="form-floating mb-1">
                    <input type="email" class="form-control-plaintext" id="floatingEmail" readonly />
                    <label class="g-bold" for="floatingEmail">E-mail</label>
                </div>

                <div class="form-floating mb-1">
                    <input type="password" class="form-control-plaintext" id="floatingPassword" readonly />
                    <label class="g-bold" for="floatingPassword">Senha</label>
                </div>

                <input type="hidden" id="profileImgName" name="profileImgName" />

                <div class="mt-4">
                    <button class="btn btn-primary" type="button" id="editButton">Editar Perfil</button>
                    <button class="btn btn-success d-none" type="button" id="saveButton">Salvar</button>
                    <button class="btn btn-danger d-none" type="button" id="cancelButton">Cancelar</button>
                </div>

                <div id="loading" class="d-none mt-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </div>
            </form>


            <div class="modal fade" id="meuModal" tabindex="-1" aria-labelledby="meuModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="meuModalLabel">Selecione seu avatar</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="avatar-options" class="mb-3"></div>
                        </div>
                    </div>
                </div>
            </div>        

        `
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {}
    }

    getForm() {
        if (!this.elements.form) {
            this.elements.form = document.querySelector('#profileForm')
        }
        return this.elements.form
    }

    getAvatarOptions() {
        if (!this.elements.avatarOptions) {
            this.elements.avatarOptions = document.querySelector('#avatar-options')
        }
        return this.elements.avatarOptions
    }

    getProfileImgNameInput() {
        if (!this.elements.profileImgNameInput) {
            this.elements.profileImgNameInput = document.querySelector('#profileImgName')
        }
        return this.elements.profileImgNameInput
    }

    getNameInput() {
        if (!this.elements.nameInput) {
            this.elements.nameInput = document.querySelector('#floatingName')
        }
        return this.elements.nameInput
    }

    getEmailInput() {
        if (!this.elements.emailInput) {
            this.elements.emailInput = document.querySelector('#floatingEmail')
        }
        return this.elements.emailInput
    }

    getPasswordInput() {
        if (!this.elements.passwordInput) {
            this.elements.passwordInput = document.querySelector('#floatingPassword')
        }
        return this.elements.passwordInput
    }

    getEditButton() {
        if (!this.elements.editButton) {
            this.elements.editButton = document.querySelector('#editButton')
        }
        return this.elements.editButton
    }

    getSaveButton() {
        if (!this.elements.saveButton) {
            this.elements.saveButton = document.querySelector('#saveButton')
        }
        return this.elements.saveButton
    }

    getCancelButton() {
        if (!this.elements.cancelButton) {
            this.elements.cancelButton = document.querySelector('#cancelButton')
        }
        return this.elements.cancelButton
    }

    getLoadingDiv() {
        if (!this.elements.loadingDiv) {
            this.elements.loadingDiv = document.querySelector('#loading')
        }
        return this.elements.loadingDiv
    }

    getFooterTag() {
        if (!this.elements.footerTag) {
            this.elements.footerTag = document.querySelector('#footer')
        }
        return this.elements.footerTag
    }

    destroy() {
        this.elements = {}
    }
}
