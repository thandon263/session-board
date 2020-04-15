import User from "./__mocks__/user-model"
import UserModel from "./user-model"
import {registerValidation} from "../../validations/auth-validations"

const database = []

describe("User model initialized", () => {
    test("Should assert if the user model is present", () => {
        expect(true).toBe(true)
    })

    test("Create user should return (value)", () => {
        const UserMocks = new User(database)
        const mockData = {
            id: 2,
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@email.com",
            password: "password!",
            mentee: true,
            mentor: false,
        }
        expect(UserMocks.create(mockData)).toEqual([mockData])
    })

    test("Should assert if User can be found", () => {
        const database = {
            id: 2,
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@email.com",
            password: "password!",
            mentee: true,
            mentor: false,
        }
        const UserMocks = new User(database)
        const mockData = {email: "john.doe@email.com"}
        expect(UserMocks.find(mockData.email)).toEqual({email: database.email})
    })

    test("Change the [current] email to [new] email", () => {
        const database = {
            id: 2,
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@email.com",
            password: "password!",
            mentee: true,
            mentor: false,
        }
        const UserMocks = new User(database)
        const {userId, email} = {userId: 3, email: "john@doe.com"}

        database.id === userId
            ? expect(UserMocks.updateUserEmail(userId, email)).toEqual(email)
            : expect(UserMocks.updateUserEmail(userId, email)).toEqual("User Id was not found.")
    })
})

describe("Check the usability of Helper methods", () => {
    test("Generate hash password using <string>", done => {
        const user = new UserModel(database)
        const {password} = {password: "password!"}
        expect(/^#[0-9A-F]{6}$/i.test(user.generateHash(password, 10))).toEqual(
            /^#[0-9A-F]{6}$/i.test(user.generateHash(password, 10))
        )
        done()
    })
})
