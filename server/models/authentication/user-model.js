import bcrypt from "bcrypt"
import {promisify} from "util"
import {randomBytes} from "crypto"
import regeneratorRuntime, {async} from "regenerator-runtime"
export default class UserModel {
    /**
     * @class UserModel
     * @description All User related tasks are performed here (Create, Find etc.)
     * @author Thando Ncube
     * @param {db} db
     */
    constructor(db) {
        this.db = db
    }

    async create({first_name, last_name, email, password, mentor, mentee}) {
        return await this.db("users").insert(
            {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                mentor: mentor,
                mentee: mentee,
                first_created: new Date().toUTCString(),
                last_login: new Date().toUTCString(),
            },
            ["id", "first_name", "last_name", "email", "mentor", "mentee", "first_created", "last_login"]
        )
    }

    async find(email) {
        const users = await this.db("users")
            .select()
            .where({email})

        if (users.length < 1) {
            throw new Error(`User not found with email: ${email}`)
        } else {
            const user = users[0]
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
                mentor: user.mentor,
                mentee: user.mentee,
                last_login: user.last_login,
                last_logout: user.last_logout,
            }
        }
    }

    async findByUserId(id) {
        const users = await this.db("users")
            .select()
            .where({id})

        if (users.length < 1) {
            throw new Error(`User not found with id: ${id}`)
        } else {
            const user = users[0]
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
                mentor: user.mentor,
                mentee: user.mentee,
                last_login: user.last_login,
                last_logout: user.last_logout,
            }
        }
    }

    async updateUserEmail(userId, email) {
        const updated = await this.db("users")
            .where({id: userId})
            .update(
                {
                    email: email,
                    last_modified: new Date().toUTCString(),
                },
                ["id", "email", "last_modified"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update email.")
        }

        return updated[0]
    }

    async updateUserName(userId, firstName, lastName) {
        const updated = await this.db("users")
            .where({
                id: userId,
            })
            .update(
                {
                    first_name: firstName,
                    last_name: lastName,
                    last_modified: new Date().toUTCString(),
                },
                ["id", "first_name", "last_name", "last_modified"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update User Names.")
        }

        return updated[0]
    }

    async updatePassword(userId, password) {
        const updated = await this.db("users")
            .where({id: userId})
            .update(
                {
                    password: password,
                    last_modified: new Date().toUTCString(),
                },
                ["id", "email"]
            )
        if (updated.length !== 1) {
            throw new Error("Failed to update password.")
        }

        return updated[0]
    }

    async resetPassword(email) {
        const user = await this.find(email)
        const code = await this.generateResetCode()
        let createdTime = new Date().toUTCString()
        let updatedTime = new Date().toUTCString()
        const entries = await this.db(
            "reset_password"
        ).insert(
            this.db.raw(
                "(user_id, reset_code, created_at, updated_at) VALUES (?,?,?,?)" +
                    " ON CONFLICT ON CONSTRAINT reset_password_user_id_unique" +
                    " DO UPDATE SET reset_code = ?, updated_at = ?",
                [user.id.toString(), code, createdTime, updatedTime, code, updatedTime]
            ),
            ["user_id", "reset_code", "created_at", "updated_at"]
        )
        if (entries.length === 0) {
            throw new Error("Unable to create entry to reset password")
        }
        const entry = entries[0]
        return {resetCode: entry.reset_code, created_at: entry.created_at}
    }

    async findResetPasswordEntry(code) {
        const entries = await this.db("reset_password")
            .where({
                reset_code: code,
            })
            .select()
        if (entries.length === 0) {
            throw new Error("Unable to find entry code")
        }
        const entry = entries[0]
        return {
            user_id: entry.user_id,
            reset_code: entry.reset_code,
            first_created: entry.created_at,
            last_modified: entry.updated_at,
        }
    }

    async deletePasswordResetEntry(userId) {
        return this.db("reset_password")
            .where({user_id: userId})
            .del()
    }

    async updateLastLogin(userId) {
        const updated = await this.db("users")
            .where({id: userId})
            .update(
                {
                    last_login: new Date().toUTCString(),
                },
                ["last_login"]
            )
        if (updated.length !== 1) {
            throw new Error(`Failed to update last login time ${new Date().toUTCString()}`)
        }

        return updated[0]
    }

    async updateLastLogout(userId) {
        const updated = await this.db("users")
            .where({id: userId})
            .update(
                {
                    last_logout: new Date().toUTCString(),
                },
                ["last_logout"]
            )
        if (updated.length !== 1) {
            throw new Error(`Failed to update last logout time ${new Date().toUTCString()}`)
        }

        return updated[0]
    }

    // Helper methods /**
    /***
     * @param {*} password
     * @param {*} hashedPassword
     */
    async validateUser(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }

    async generateHash(password, number) {
        // Hash the password
        const salt = await bcrypt.genSalt(number)
        const hashedPassword = await bcrypt.hash(password, salt)

        return hashedPassword
    }

    async generateResetCode() {
        const random = promisify(randomBytes)
        const token = await random(16)
        const shortToken = token.slice(0, 3)
        return shortToken.toString("hex").toUpperCase()
    }
}
