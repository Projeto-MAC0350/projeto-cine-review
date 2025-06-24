package services

import db.tables.Users
import db.dbo.UserDbo
import db.dbo.toUserDbo
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.update
import org.jetbrains.exposed.sql.transactions.transaction

class UserService {

    fun getUsers(): List<UserDbo> = transaction {
        Users.selectAll()
            .map { it.toUserDbo() }
    }

    fun getUserById(id: Int): UserDbo? = transaction {
        Users.select { Users.id eq id }
            .mapNotNull { it.toUserDbo() }
            .singleOrNull()
    }

    fun getUserByName(name: String): UserDbo? = transaction {
        Users.select { Users.name eq name }
            .mapNotNull { it.toUserDbo() }
            .singleOrNull()
    }

    fun getUserByEmail(email: String): UserDbo? = transaction {
        Users.select { Users.email eq email }
            .mapNotNull { it.toUserDbo() }
            .singleOrNull()
    }

    fun addUser(user: UserDbo): UserDbo = transaction {
        val stmt = Users.insert { stmt ->
            stmt[Users.name]     = user.name
            stmt[Users.email]    = user.email
            stmt[Users.password] = user.password
            stmt[Users.role]     = user.role
        }
        val generatedId = stmt[Users.id]
        user.copy(id = generatedId)
    }

    fun deleteUser(id: Int): Boolean = transaction {
        Users.deleteWhere { Users.id eq id } > 0
    }

    fun updateUserEmail(user: UserDbo): Boolean = transaction {
        Users.update({ Users.id eq user.id }) { stmt ->
            stmt[Users.email] = user.email
        } > 0
    }

    fun updateUserPassword(user: UserDbo): Boolean = transaction {
        Users.update({ Users.id eq user.id }) { stmt ->
            stmt[Users.password] = user.password
        } > 0
    }
}
