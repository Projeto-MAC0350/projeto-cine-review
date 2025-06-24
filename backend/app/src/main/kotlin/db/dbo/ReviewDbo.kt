package db.dbo

import db.tables.Reviews
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDate

data class ReviewDbo(
    val id: Int,
    val movieId: Int,
    val userId: Int,
    val rating: Int,
    val comment: String?,
    val title: String?,
    val date: LocalDate
)

fun ResultRow.toReviewDbo(): ReviewDbo {
    return ReviewDbo(
        id = this[Reviews.id],
        movieId = this[Reviews.movie_id],
        userId = this[Reviews.user_id],
        rating = this[Reviews.rating],
        comment = this[Reviews.comment],
        title = this[Reviews.title],
        date = this[Reviews.date],
    )
}