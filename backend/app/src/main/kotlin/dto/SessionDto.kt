package dto

import db.dbo.SessionDbo
import db.tables.Sessions
import java.time.LocalDateTime

data class SessionDto(
    val id: Int,
    val movieId: Int,
    val theater: String,
    val date: LocalDateTime
) {
    companion object {
        fun fromDbo(session: SessionDbo): SessionDto {
            return SessionDto(
                id = session.id,
                movieId = session.movieId,
                theater = session.theater.name,
                date = session.date
            )
        }
    }
}