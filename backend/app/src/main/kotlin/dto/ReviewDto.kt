package dto

import db.dbo.ReviewDbo
import db.tables.Reviews
import db.tables.Users
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName
import java.time.LocalDateTime

@Serializable
data class ReviewDto(
    val id: Int,
    val userId: Int,
    val movieId: Int,
    val comment: String?,
    val rating: Double,
    val title: String?,
    @SerialName("date")
    val date: String
) {
    companion object {
        fun fromDbo(dbo: ReviewDbo): ReviewDto {
            return ReviewDto(
                id = dbo.id,
                userId = dbo.userId,
                movieId = dbo.movieId,
                comment = dbo.comment,
                rating = dbo.rating / 2.0,
                title = dbo.title,
                date = dbo.date
            )
        }

        fun toDbo(dto: ReviewDto): ReviewDbo {
            val ratingInt = (dto.rating * 2).toInt()
            return ReviewDbo(
                id = dto.id,
                userId = dto.userId,
                movieId = dto.movieId,
                comment = dto.comment,
                rating = ratingInt,
                title = dto.title,
                date = dto.date
            )
        }
    }
}
