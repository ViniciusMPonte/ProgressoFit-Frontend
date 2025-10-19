import { LocalStorageCRUDService } from './LocalStorageCRUDService.js'

export class PromptService {
    constructor() {
        this.localStorageService = new LocalStorageCRUDService('user')

        this.templates = {
            congratulation: {
                context: 'Você é um assistente motivacional para treinos',
                task: 'Criar mensagem de parabenização',
                tone: 'entusiasta e encorajador',
            },
            motivation: {
                context: 'Você é um personal trainer virtual',
                task: 'Criar mensagem motivacional',
                tone: 'inspirador e positivo',
            },
            reminder: {
                context: 'Você é um assistente de saúde e bem-estar',
                task: 'Criar lembrete',
                tone: 'amigável e gentil',
            },
            analysis: {
                context: 'Você é um analista de performance fitness',
                task: 'Analisar dados',
                tone: 'objetivo e informativo',
            },
            weightCongratulation: {
                context: 'Você é um nutricionista motivacional',
                task: 'Criar mensagem de parabenização por progresso de peso',
                tone: 'encorajador e profissional',
            },
            weightMotivation: {
                context: 'Você é um coach de emagrecimento/ganho de peso',
                task: 'Criar mensagem motivacional sobre meta de peso',
                tone: 'empático e motivador',
            },
        }
    }

    /**
     * Define o nome do usuário para personalização
     */
    setUserName(userName) {
        this.userName = userName
    }

    getUserName() {
        if (!this.userName) {
            this.userName = this.localStorageService.findOne((item) => item.name !== '').name
        }
        return this.userName
    }

    /**
     * Obtém o nome do usuário ou string vazia
     */
    _getUserGreeting() {
        return this.getUserName() ? `${this.getUserName()}, ` : ''
    }

    /**
     * Cria um prompt personalizado baseado em template
     */
    createFromTemplate(templateName, data) {
        const template = this.templates[templateName]
        if (!template) {
            throw new Error(`Template "${templateName}" não encontrado`)
        }

        return this._buildPrompt(template, data)
    }

    /**
     * Cria prompt de congratulação por progresso de treino
     */
    createCongratulationPrompt(percentage, consecutiveWeeks = null) {
        const template = this.templates.congratulation
        const greeting = this._getUserGreeting()
        const data = {
            percentage,
            consecutiveWeeks,
            additionalInfo: consecutiveWeeks ? `com ${consecutiveWeeks} semanas consecutivas de treino` : '',
        }

        return this._buildPrompt(template, {
            message: `Crie uma mensagem de parabenização para ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            } por ter conseguido ${percentage}% da meta de treinos semanal${data.additionalInfo ? ' ' + data.additionalInfo : ''}. ${
                greeting ? `Use o nome ${this.getUserName()} na mensagem de forma natural. ` : ''
            }Não faça perguntas nem comentários para mim, apenas crie a mensagem.`,
        })
    }

    /**
     * Cria prompt de motivação para continuar treinando
     */
    createMotivationPrompt(weeksRemaining, currentStreak) {
        const template = this.templates.motivation
        const greeting = this._getUserGreeting()

        return this._buildPrompt(template, {
            message: `Crie uma mensagem motivacional curta para ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            }. Faltam ${weeksRemaining} semanas para completar a meta e já foram completadas ${currentStreak} semanas consecutivas. ${
                greeting ? `Use o nome ${this.getUserName()} na mensagem. ` : ''
            }Seja direto e inspirador.`,
        })
    }

    /**
     * Cria prompt de recuperação após falha
     */
    createRecoveryPrompt(failureReason = 'não cumprimento da meta') {
        const template = this.templates.motivation
        const greeting = this._getUserGreeting()

        return this._buildPrompt(template, {
            message: `Crie uma mensagem breve e encorajadora para ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            } não desistir após ${failureReason}. ${
                greeting ? `Use o nome ${this.getUserName()} de forma natural. ` : ''
            }Foque em recomeçar e não em culpa. Seja positivo e prático.`,
        })
    }

    /**
     * Cria prompt de análise de performance
     */
    createAnalysisPrompt(metrics) {
        const template = this.templates.analysis
        const { percentage, consecutiveWeeks, totalWeeks, goalFailed } = metrics
        const greeting = this._getUserGreeting()

        return this._buildPrompt(template, {
            message: `Analise brevemente o progresso de ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            }: ${percentage}% concluído, ${consecutiveWeeks} de ${totalWeeks} semanas consecutivas completadas${
                goalFailed ? ', meta não atingida' : ''
            }. ${greeting ? `Inclua o nome ${this.getUserName()} na análise. ` : ''}Dê insights práticos em no máximo 3 frases.`,
        })
    }

    /**
     * Cria prompt de lembrete personalizado
     */
    createReminderPrompt(daysWithoutTraining, nextGoalDate = null) {
        const template = this.templates.reminder
        const dateInfo = nextGoalDate ? ` Próxima meta: ${nextGoalDate}.` : ''
        const greeting = this._getUserGreeting()

        return this._buildPrompt(template, {
            message: `Crie um lembrete amigável e curto para ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            } se motivar a treinar. Já se passaram ${daysWithoutTraining} dias sem treinar.${dateInfo} ${
                greeting ? `Use o nome ${this.getUserName()}. ` : ''
            }Seja gentil mas direto.`,
        })
    }

    /**
     * Cria prompt de congratulação por progresso de peso
     */
    createWeightCongratulationPrompt(percentage, currentWeight, targetWeight, direction) {
        const template = this.templates.weightCongratulation
        const greeting = this._getUserGreeting()
        const goalType = direction > 0 ? 'ganhar' : 'perder'
        const directionText = direction > 0 ? 'ganho' : 'perda'

        return this._buildPrompt(template, {
            message: `Crie uma mensagem de parabenização para ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            } por ter alcançado ${percentage}% da meta de ${directionText} de peso. Peso atual: ${currentWeight}kg, meta: ${targetWeight}kg. ${
                greeting ? `Use o nome ${this.getUserName()} de forma natural e calorosa. ` : ''
            }Não faça perguntas nem comentários para mim, apenas parabenize de forma sincera e motivadora.`,
        })
    }

    /**
     * Cria prompt de motivação para meta de peso
     */
    createWeightMotivationPrompt(percentage, currentWeight, targetWeight, direction, daysRemaining = null) {
        const template = this.templates.weightMotivation
        const greeting = this._getUserGreeting()
        const goalType = direction > 0 ? 'ganhar' : 'perder'
        const remaining = Math.abs(targetWeight - currentWeight).toFixed(1)
        const timeInfo = daysRemaining ? ` em ${daysRemaining} dias` : ''

        return this._buildPrompt(template, {
            message: `Crie uma mensagem motivacional para ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            } que está em ${percentage}% da meta de ${goalType} peso. Faltam ${remaining}kg para atingir ${targetWeight}kg${timeInfo}. ${
                greeting ? `Use o nome ${this.getUserName()}. ` : ''
            }Seja encorajador e prático, oferecendo uma perspectiva positiva.`,
        })
    }

    /**
     * Cria prompt para análise de progresso de peso
     */
    createWeightAnalysisPrompt(startWeight, currentWeight, targetWeight, percentage, goalFailed, direction) {
        const template = this.templates.analysis
        const greeting = this._getUserGreeting()
        const change = (currentWeight - startWeight).toFixed(1)
        const changeDirection = direction > 0 ? 'ganhou' : 'perdeu'
        const goalType = direction > 0 ? 'ganho' : 'perda'

        return this._buildPrompt(template, {
            message: `Analise o progresso de peso de ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            }: iniciou com ${startWeight}kg, está com ${currentWeight}kg (${changeDirection} ${Math.abs(
                change
            )}kg), meta é ${targetWeight}kg. Progresso: ${percentage}%${goalFailed ? ', meta não atingida' : ''}. ${
                greeting ? `Mencione ${this.getUserName()} na análise. ` : ''
            }Dê insights práticos sobre a jornada de ${goalType} de peso em no máximo 3 frases.`,
        })
    }

    /**
     * Cria prompt para lembrete de pesagem
     */
    createWeightReminderPrompt(daysSinceLastWeighing, currentGoalType = null) {
        const template = this.templates.reminder
        const greeting = this._getUserGreeting()
        const goalInfo = currentGoalType ? ` sobre sua meta de ${currentGoalType}` : ''

        return this._buildPrompt(template, {
            message: `Crie um lembrete gentil para ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            } se pesar. Já se passaram ${daysSinceLastWeighing} dias desde a última pesagem${goalInfo}. ${
                greeting ? `Use o nome ${this.getUserName()}. ` : ''
            }Seja amigável e encoraje o acompanhamento regular sem pressão.`,
        })
    }

    /**
     * Cria prompt de recuperação para meta de peso não atingida
     */
    createWeightRecoveryPrompt(missedGoalType, percentageAchieved = null) {
        const template = this.templates.weightMotivation
        const greeting = this._getUserGreeting()
        const achievementInfo = percentageAchieved ? ` mas conseguiu ${percentageAchieved}% do caminho` : ''

        return this._buildPrompt(template, {
            message: `Crie uma mensagem empática e encorajadora para ${
                greeting ? greeting.slice(0, -2) : 'o usuário'
            } que não atingiu a meta de ${missedGoalType} de peso${achievementInfo}. ${
                greeting ? `Use o nome ${this.getUserName()} de forma carinhosa. ` : ''
            }Foque em aprendizados, próximos passos e não em falha. Seja compreensivo e motivador para criar uma nova meta.`,
        })
    }

    /**
     * Cria prompt customizado completo
     */
    createCustomPrompt({ context, task, tone, message, constraints = [] }) {
        const parts = []
        const greeting = this._getUserGreeting()

        if (context) parts.push(`Contexto: ${context}`)
        if (task) parts.push(`Tarefa: ${task}`)
        if (tone) parts.push(`Tom: ${tone}`)
        if (constraints.length > 0) {
            parts.push(`Restrições: ${constraints.join(', ')}`)
        }
        if (greeting) parts.push(`Nome do usuário: ${this.getUserName()}`)
        if (message) parts.push(`\n${message}`)

        return parts.join('\n')
    }

    /**
     * Adiciona instruções para não fazer perguntas
     */
    withNoQuestions(prompt) {
        return `${prompt}\n\nImportante: Não faça perguntas nem comentários para mim, apenas forneça a resposta.`
    }

    /**
     * Adiciona limite de tamanho à resposta
     */
    withMaxLength(prompt, maxSentences) {
        return `${prompt}\n\nLimite: Use no máximo ${maxSentences} frase${maxSentences > 1 ? 's' : ''}.`
    }

    /**
     * Adiciona formato específico à resposta
     */
    withFormat(prompt, format) {
        const formats = {
            bullet: 'em lista de tópicos',
            paragraph: 'em parágrafo corrido',
            short: 'em formato ultra-conciso',
            emoji: 'com emojis relevantes',
        }

        const formatText = formats[format] || format
        return `${prompt}\n\nFormato: Responda ${formatText}.`
    }

    /**
     * Método interno para construir prompt baseado em template
     */
    _buildPrompt(template, data) {
        const parts = []

        if (template.context) {
            parts.push(`Contexto: ${template.context}`)
        }
        if (template.task) {
            parts.push(`Tarefa: ${template.task}`)
        }
        if (template.tone) {
            parts.push(`Tom: ${template.tone}`)
        }
        if (this.getUserName()) {
            parts.push(`Nome do usuário: ${this.getUserName()}`)
        }
        if (data.message) {
            parts.push(`\n${data.message}`)
        }

        return parts.join('\n')
    }

    /**
     * Registra um novo template personalizado
     */
    registerTemplate(name, { context, task, tone }) {
        this.templates[name] = { context, task, tone }
    }

    /**
     * Lista todos os templates disponíveis
     */
    getAvailableTemplates() {
        return Object.keys(this.templates)
    }
}
