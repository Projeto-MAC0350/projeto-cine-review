package db.dbo

import db.tables.Reviews
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class ReviewDbo(
    val id: Int,
    val userId: Int,
    val movieId: Int,
    val comment: String?,
    val rating: Int,
    val title: String?,
    val date: String
)

fun ResultRow.toReviewDbo(): ReviewDbo {
    return ReviewDbo(
        id = this[Reviews.id],
        userId = this[Reviews.user_id],
        movieId = this[Reviews.movie_id],
        comment = this[Reviews.comment],
        rating = this[Reviews.rating],
        title = this[Reviews.title],
        date = this[Reviews.date].toString(),
    )
}