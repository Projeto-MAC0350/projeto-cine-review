package services

import db.tables.Reviews
import db.dbo.toReviewDbo
import dto.ReviewDto
import dto.ReviewCreateDto
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate
import db.dbo.ReviewDbo

class ReviewService {

    fun getReviews(): List<ReviewDbo> = transaction {
        Reviews.selectAll()
            .map { it.toReviewDbo() }
    }

    fun getReviewById(id: Int): ReviewDbo? = transaction {
        Reviews.select { Reviews.id eq id }
            .mapNotNull { it.toReviewDbo() }
            .singleOrNull()
    }

    fun getReviewsByUserId(userId: Int): List<ReviewDbo> = transaction {
        Reviews.select { Reviews.user_id eq userId }
            .map { it.toReviewDbo() }
    }

    fun getReviewsByMovieId(movieId: Int): List<ReviewDto> = transaction {
        Reviews.select { Reviews.movie_id eq movieId }
            .map { it.toReviewDbo() }
            .map { ReviewDto.fromDbo(it) }
    }

    fun addReview(
        dto: ReviewCreateDto,
        userId: Int,
        movieId: Int
    ): ReviewDto = transaction {
        val today = LocalDate.now()
        val ratingInt = (dto.rating * 2).toInt()

        val stmt = Reviews.insert {
            it[Reviews.user_id]  = userId
            it[Reviews.movie_id] = movieId
            it[Reviews.comment]  = dto.comment
            it[Reviews.rating]   = ratingInt
            it[Reviews.title]    = dto.title
            it[Reviews.date]     = today
        }

        val dbo = stmt.resultedValues!!.first().toReviewDbo()
        ReviewDto.fromDbo(dbo)
    }

    fun deleteReview(id: Int): Boolean = transaction {
        Reviews.deleteWhere { Reviews.id eq id } > 0
    }

    fun updateReview(review: ReviewDbo): Boolean = transaction {
        Reviews.update({ Reviews.id eq review.id }) { stmt ->
            stmt[Reviews.comment] = review.comment
            stmt[Reviews.title] = review.title
        } > 0
    }
}
