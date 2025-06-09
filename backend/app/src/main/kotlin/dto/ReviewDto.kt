package dto

import db.dbo.ReviewDbo
import db.tables.Reviews
import db.tables.Users
import java.time.LocalDate

data class ReviewDto(
    val id: Int,
    val userId: Int,
    val movieId: Int,
    val comment: String?,
    val rating: Int,
    val title: String?,
    val date: LocalDate
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
                date = dbo.date
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
                date = dto.date
            )
        }
    }
}
