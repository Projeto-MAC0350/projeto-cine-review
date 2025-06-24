package db.dbo

import db.tables.Sessions
import org.jetbrains.exposed.sql.ResultRow
import db.enums.THEATER
import java.time.LocalDateTime

data class SessionDbo(
    val id: Int,
    val movieId: Int,
    val theater: THEATER,
    val date: LocalDateTime
)

fun ResultRow.toSessionDbo(): SessionDbo {
    return SessionDbo(
        id = this[Sessions.id],
        movieId = this[Sessions.movie_id],
        theater = this[Sessions.theater],
        date = this[Sessions.date]
    )
}