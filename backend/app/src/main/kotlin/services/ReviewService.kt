package services

import db.tables.Reviews
import db.dbo.ReviewDbo
import db.dbo.toReviewDbo
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class ReviewService {

    fun getReviews(): List<ReviewDbo> {
        return transaction {
            Reviews.selectAll().map { it.toReviewDbo() }
        }
    }

    fun getReviewById(id: Int): ReviewDbo? {
        return transaction {
            Reviews.select { Reviews.id eq id }
                .mapNotNull { it.toReviewDbo() }
                .singleOrNull()
        }
    }
    
    fun getReviewsByUserId(userId: Int): List<ReviewDbo> {
        return transaction {
            Reviews.select { Reviews.user_id eq userId }
                .map { it.toReviewDbo() }
        }
    }

    fun getReviewsByMovieId(movieId: Int): List<ReviewDbo> {
        return transaction {
            Reviews.select { Reviews.movie_id eq movieId }
                .map { it.toReviewDbo() }
        }
    }

    fun addReview(review: ReviewDbo): ReviewDbo {
        return transaction {
            val id = Reviews.insertAndGetId {
                it[user_id] = review.userId
                it[movie_id] = review.movieId
                it[rating] = review.rating
                it[comment] = review.comment
                it[title] = review.title
                it[date] = review.date.atStartOfDay()
            }
            review.copy(id = id.value)
        }
    }

    fun deleteReview(id: Int): Boolean {
        return transaction {
            Reviews.deleteWhere { Reviews.id eq id } > 0
        }
    }

    fun updateReview(review: ReviewDbo): Boolean {
        return transaction {
            Reviews.update({ Reviews.id eq review.id }) {
                it[comment] = review.comment
                it[title] = review.title
            } > 0
        }
    }
}