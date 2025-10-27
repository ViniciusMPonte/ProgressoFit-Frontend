import { ApiService } from '../../../../service/ApiService.js'
import { RegisterDTO } from '../../../../model/dto/RegisterDTO.js'

export class EditProfileService {
    constructor(dom) {
        this.apiService = new ApiService()
        this.dom = dom
        this.callbackForm = null
    }

    setCallbackForm(cbFunction) {
        this.callbackForm = cbFunction
    }

    async loadUserProfile() {
        try {
            const response = await this.apiService.get('/api/user')

            if (response.success && response.data) {
                this.populateForm(response.data)
                return { success: true, data: response.data }
            }

            return { success: false, message: 'Erro ao carregar dados do usuário' }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error)
            return { success: false, message: 'Erro interno ao carregar perfil' }
        }
    }

    populateForm(userData) {
        const nameInput = this.dom.getNameInput()
        const emailInput = this.dom.getEmailInput()
        const passwordInput = this.dom.getPasswordInput()
        const profileImgNameInput = this.dom.getProfileImgNameInput()

        if (nameInput) nameInput.value = userData.name || ''
        if (emailInput) emailInput.value = userData.email || ''
        if (passwordInput) passwordInput.value = '********'
        if (profileImgNameInput) profileImgNameInput.value = userData.profileImgName || ''
    }

    async updateProfile() {
        const name = this.dom.getNameInput()?.value
        const email = this.dom.getEmailInput()?.value
        const password = this.dom.getPasswordInput()?.value
        const profileImgName = this.dom.getProfileImgNameInput()?.value

        const registerDto = new RegisterDTO(name, email, password, profileImgName)
        const validation = registerDto.validate()

        if (!validation.isValid) {
            return { success: false, message: validation.errors[0], type: 'warning' }
        }

        try {
            const result = await this.apiService.put('/api/user', registerDto)

            if (result.success) {
                return { success: true }
            } else {
                return { success: false, message: result.message || 'Erro ao atualizar perfil', type: 'danger' }
            }
        } catch (error) {
            console.error('Erro durante a atualização:', error)
            return { success: false, message: 'Erro interno. Tente novamente mais tarde.', type: 'danger' }
        }
    }
}