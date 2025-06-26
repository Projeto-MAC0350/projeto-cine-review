package dto

import db.dbo.SessionDbo
import db.tables.Sessions
import java.time.LocalDateTime
import kotlinx.serialization.Serializable

@Serializable
data class SessionDto(
    val id: Int,
    val movieId: Int,
    val theater: String,
    val date: String
) {
    companion object {
        fun fromDbo(session: SessionDbo): SessionDto {
            return SessionDto(
                id = session.id,
                movieId = session.movieId,
                theater = session.theater.name,
                date = session.date.toString()
            )
        }
    }
}