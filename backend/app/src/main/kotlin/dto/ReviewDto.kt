package dto

import db.dbo.ReviewDbo
import db.tables.Reviews
import db.tables.Users
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

@Serializable
data class ReviewDto(
    val id: Int,
    val userId: Int,
    val movieId: Int,
    val comment: String?,
    val rating: Int,
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
                rating = dbo.rating,
                title = dbo.title,
                date = dbo.date.toString()
            )
        }

        fun toDbo(dto: ReviewDto): ReviewDbo {
            return ReviewDbo(
                id = dto.id,
                userId = dto.userId,
                movieId = dto.movieId,
                comment = dto.comment,
                rating = dto.rating,
                title = dto.title,
                date = java.time.LocalDate.parse(dto.date)
            )
        }
    }
}
