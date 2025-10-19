export class LocalStorageCRUDService {
    constructor(key) {
        this.key = key
        this.init()
    }

    init() {
        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, JSON.stringify([]))
        }
    }

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || []
        } catch (e) {
            console.error('Erro ao ler dados:', e)
            return []
        }
    }

    getById(id) {
        const items = this.getAll()
        return items.find(item => item.id === id)
    }

    find(predicate) {
        const items = this.getAll()
        return items.filter(predicate)
    }

    findOne(predicate) {
        const items = this.getAll()
        return items.find(predicate)
    }

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

    createIfNotExists(predicate, data) {
        const existingItem = this.findOne(predicate)
        
        if (existingItem) {
            return {
                created: false,
                item: existingItem,
                message: 'Item já existe'
            }
        }

        const newItem = this.create(data)
        return {
            created: true,
            item: newItem,
            message: 'Item criado com sucesso'
        }
    }

    createOrUpdate(predicate, data) {
        const existingItem = this.findOne(predicate)
        
        if (existingItem) {
            const updatedItem = this.update(existingItem.id, data)
            return {
                created: false,
                updated: true,
                item: updatedItem,
                message: 'Item atualizado'
            }
        }

        const newItem = this.create(data)
        return {
            created: true,
            updated: false,
            item: newItem,
            message: 'Item criado'
        }
    }

    update(id, data) {
        const items = this.getAll()
        const index = items.findIndex(item => item.id === id)

        if (index === -1) {
            throw new Error(`Item com ID ${id} não encontrado`)
        }

        items[index] = {
            ...items[index],
            ...data,
            id: items[index].id,
            createdAt: items[index].createdAt,
            updatedAt: new Date().toISOString(),
        }

        localStorage.setItem(this.key, JSON.stringify(items))
        return items[index]
    }

    delete(id) {
        const items = this.getAll()
        const filtered = items.filter(item => item.id !== id)

        if (items.length === filtered.length) {
            throw new Error(`Item com ID ${id} não encontrado`)
        }

        localStorage.setItem(this.key, JSON.stringify(filtered))
        return true
    }

    deleteAll() {
        localStorage.setItem(this.key, JSON.stringify([]))
        return true
    }

    count() {
        return this.getAll().length
    }

    exists(predicate) {
        return this.findOne(predicate) !== undefined
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
}