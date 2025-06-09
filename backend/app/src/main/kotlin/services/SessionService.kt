package services

import db.tables.Session
import db.dbo.SessionDbo
import db.dbo.toSessionDbo
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class SessionService {

    fun getSessions(): List<SessionDbo> {
        return transaction {
            Session.selectAll().map { it.toSessionDbo() }
        }
    }

    fun getSessionById(id: Int): SessionDbo? {
        return transaction {
            Session.select { Session.id eq id }
                .mapNotNull { it.toSessionDbo() }
                .singleOrNull()
        }
    }

    fun getSessionsByMovieId(movieId: Int): List<SessionDbo> {
        return transaction {
            Session.select { Session.movieId eq movieId }
                .map { it.toSessionDbo() }
        }
    }
}