package services

import db.tables.SessionsLogins
import db.dbo.SessionsLoginDbo
import db.dbo.toSessionsLoginDbo
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.update
import org.jetbrains.exposed.sql.transactions.transaction

class SessionsLoginService {

    fun getSessionsLogins(): List<SessionsLoginDbo> = transaction {
        SessionsLogins.selectAll()
            .map { it.toSessionsLoginDbo() }
    }

    fun getSessionLoginById(id: Int): SessionsLoginDbo? = transaction {
        SessionsLogins.select { SessionsLogins.id eq id }
            .mapNotNull { it.toSessionsLoginDbo() }
            .singleOrNull()
    }

    fun getSessionsLoginsByUserId(userId: Int): List<SessionsLoginDbo> = transaction {
        SessionsLogins.select { SessionsLogins.user_id eq userId }
            .map { it.toSessionsLoginDbo() }
    }

    fun addSessionLogin(sessionLogin: SessionsLoginDbo): SessionsLoginDbo = transaction {
        val stmt = SessionsLogins.insert { stmt ->
            stmt[SessionsLogins.user_id]    = sessionLogin.userId
            stmt[SessionsLogins.login_time]  = sessionLogin.loginTime
            stmt[SessionsLogins.logout_time] = sessionLogin.logoutTime
        }
        val generatedId = stmt[SessionsLogins.id]
        sessionLogin.copy(id = generatedId)
    }

    fun deleteSessionLogin(id: Int): Boolean = transaction {
        SessionsLogins.deleteWhere { SessionsLogins.id eq id } > 0
    }

    fun deleteSessionsLoginsByUserId(userId: Int): Boolean = transaction {
        SessionsLogins.deleteWhere { SessionsLogins.user_id eq userId } > 0
    }

    fun updateSessionLogin(sessionLogin: SessionsLoginDbo): Boolean = transaction {
        SessionsLogins.update({ SessionsLogins.id eq sessionLogin.id }) { stmt ->
            stmt[SessionsLogins.logout_time] = sessionLogin.logoutTime
        } > 0
    }
}
