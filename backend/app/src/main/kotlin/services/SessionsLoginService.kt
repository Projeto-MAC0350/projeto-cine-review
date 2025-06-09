package services

import db.tables.SessionsLogins
import db.dbo.SessionLoginDbo
import db.dbo.toSessionLoginDbo
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class SessionsLoginService {

    fun getSessionsLogins(): List<SessionLoginDbo> {
        return transaction {
            SessionsLogins.selectAll().map { it.toSessionLoginDbo() }
        }
    }

    fun getSessionLoginById(id: Int): SessionLoginDbo? {
        return transaction {
            SessionsLogins.select { SessionsLogins.id eq id }
                .mapNotNull { it.toSessionLoginDbo() }
                .singleOrNull()
        }
    }

    fun getSessionsLoginsByUserId(userId: Int): List<SessionLoginDbo> {
        return transaction {
            SessionsLogins.select { SessionsLogins.userId eq userId }
                .map { it.toSessionLoginDbo() }
        }
    }

    fun addSessionLogin(sessionLogin: SessionLoginDbo): SessionLoginDbo {
        return transaction {
            val id = SessionsLogins.insertAndGetId {
                it[user_id] = sessionLogin.userId
                it[login_time] = sessionLogin.loginTime
                it[logout_time] = sessionLogin.logoutTime
            }
            sessionLogin.copy(id = id.value)
        }
    }

    fun deleteSessionLogin(id: Int): Boolean {
        return transaction {
            SessionsLogins.deleteWhere { SessionsLogins.id eq id } > 0
        }
    }

    fun deleteSessionsLoginsByUserId(userId: Int): Boolean {
        return transaction {
            SessionsLogins.deleteWhere { SessionsLogins.userId eq userId } > 0
        }
    }

    fun updateSessionLogin(sessionLogin: SessionLoginDbo): Boolean {
        return transaction {
            SessionsLogins.update({ SessionsLogins.id eq sessionLogin.id }) {
                it[logout_time] = sessionLogin.logoutTime
            } > 0
        }
    }
}