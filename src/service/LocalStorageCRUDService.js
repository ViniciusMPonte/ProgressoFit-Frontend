export class LocalStorageCRUDService {
    constructor(key) {
        this.key = key
        this.init()
    }

    // Inicializa o storage se não existir
    init() {
        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, JSON.stringify([]))
        }
    }

    // Lê todos os dados
    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || []
        } catch (e) {
            console.error('Erro ao ler dados:', e)
            return []
        }
    }

    // Busca um item por ID
    getById(id) {
        const items = this.getAll()
        return items.find(item => item.id === id)
    }

    // Busca itens por critério
    find(predicate) {
        const items = this.getAll()
        return items.filter(predicate)
    }

    // Cria um novo item
    create(data) {
        const items = this.getAll()
        const newItem = {
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...data,
        }
        items.push(newItem)
        localStorage.setItem(this.key, JSON.stringify(items))
        return newItem
    }

    // Atualiza um item por ID
    update(id, data) {
        const items = this.getAll()
        const index = items.findIndex(item => item.id === id)

        if (index === -1) {
            throw new Error(`Item com ID ${id} não encontrado`)
        }

        items[index] = {
            ...items[index],
            ...data,
            id: items[index].id, // Preserva o ID original
            createdAt: items[index].createdAt, // Preserva data de criação
            updatedAt: new Date().toISOString(),
        }

        localStorage.setItem(this.key, JSON.stringify(items))
        return items[index]
    }

    // Deleta um item por ID
    delete(id) {
        const items = this.getAll()
        const filtered = items.filter(item => item.id !== id)

        if (items.length === filtered.length) {
            throw new Error(`Item com ID ${id} não encontrado`)
        }

        localStorage.setItem(this.key, JSON.stringify(filtered))
        return true
    }

    // Deleta todos os itens
    deleteAll() {
        localStorage.setItem(this.key, JSON.stringify([]))
        return true
    }

    // Conta total de itens
    count() {
        return this.getAll().length
    }

    // Gera um ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
}
