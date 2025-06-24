package services

import db.tables.Sessions
import db.dbo.SessionDbo
import db.dbo.toSessionDbo
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction

class SessionService {

    fun getSessions(): List<SessionDbo> = transaction {
        Sessions.selectAll()
            .map { it.toSessionDbo() }
    }

    fun getSessionById(id: Int): SessionDbo? = transaction {
        Sessions.select { Sessions.id eq id }
            .mapNotNull { it.toSessionDbo() }
            .singleOrNull()
    }

    fun getSessionsByMovieId(movieId: Int): List<SessionDbo> = transaction {
        Sessions.select { Sessions.movie_id eq movieId }
            .map { it.toSessionDbo() }
    }
}
