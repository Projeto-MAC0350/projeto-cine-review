package services

import db.tables.Reviews
import db.dbo.ReviewDbo
import db.dbo.toReviewDbo
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

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

    fun getReviewsByMovieId(movieId: Int): List<ReviewDbo> = transaction {
        Reviews.select { Reviews.movie_id eq movieId }
            .map { it.toReviewDbo() }
    }

    fun addReview(review: ReviewDbo): ReviewDbo = transaction {

        val stmt = Reviews.insert { stmt ->
            stmt[Reviews.user_id] = review.userId
            stmt[Reviews.movie_id] = review.movieId
            stmt[Reviews.rating] = review.rating
            stmt[Reviews.comment] = review.comment
            stmt[Reviews.title] = review.title
            stmt[Reviews.date] = review.date
        }

        val generatedId = stmt[Reviews.id]
        review.copy(id = generatedId)
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
