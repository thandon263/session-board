export default class UserModel {
    constructor(db) {
        this.db = db
    }

    create(data) {
        this.db.push(data)

        return this.db
    }

    find(email) {
        const users = this.db
        for (let i in users) {
            if (users.email === email) {
                return {
                    email: users.email,
                }
            }
        }
    }

    updateUserEmail(userId, email) {
        const users = this.db
        for (let i in users) {
            if (users.id === userId) {
                return (users.email = email)
            }

            return "User Id was not found."
        }
    }
}
