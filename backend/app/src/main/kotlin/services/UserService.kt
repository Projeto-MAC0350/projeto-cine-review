package services

import db.tables.Users
import db.dbo.UserDbo
import db.dbo.toUserDbo
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class UserService {

    fun getUsers(): List<UserDbo> {
        return transaction {
            Users.selectAll().map { it.toUserDbo() }
        }
    }

    fun getUserById(id: Int): UserDbo? {
        return transaction {
            Users.select { Users.id eq id }
                .mapNotNull { it.toUserDbo() }
                .singleOrNull()
        }
    }

    fun getUserByName(name: String): UserDbo? {
        return transaction {
            Users.select { Users.name eq name }
                .mapNotNull { it.toUserDbo() }
                .singleOrNull()
        }
    }

    fun getUserByEmail(email: String): UserDbo? {
        return transaction {
            Users.select { Users.email eq email }
                .mapNotNull { it.toUserDbo() }
                .singleOrNull()
        }
    }

    fun addUser(user: UserDbo): UserDbo {
        return transaction {
            val id = Users.insertAndGetId {
                it[name] = user.name
                it[email] = user.email
                it[password] = user.password
                it[role] = user.role
            }
            user.copy(id = id.value)
        }
    }

    fun deleteUser(id: Int): Boolean {
        return transaction {
            Users.deleteWhere { Users.id eq id } > 0
        }
    }

    fun updateUserEmail(user: UserDbo): Boolean {
        return transaction {
            Users.update({ Users.id eq user.id }) {
                it[email] = user.email
            } > 0
        }
    }

    fun updateUserPassword(user: UserDbo): Boolean {
        return transaction {
            Users.update({ Users.id eq user.id }) {
                it[password] = user.password
            } > 0
        }
    }
}