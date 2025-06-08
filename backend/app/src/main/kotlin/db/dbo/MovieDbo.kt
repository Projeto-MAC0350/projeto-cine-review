package db.dbo

import db.tables.Movies
import org.jetbrains.exposed.sql.ResultRow

data class MovieDbo(
    val id: Int,
    val title: String,
    val director: String?,
    val year: Int,
    val duration: Int,
    val location: String?,
    val synopsis: String?,
    val exhibitionId: Int,
    val noReviews: Int,
    val totalRating: Int,
    val movieLink: String?
)

fun ResultRow.toMovieDbo(): MovieDbo {
    return MovieDbo(
        id = this[Movies.id],
        title = this[Movies.title],
        director = this[Movies.director],
        year = this[Movies.year],
        duration = this[Movies.duration],
        location = this[Movies.location],
        synopsis = this[Movies.synopsis],
        exhibitionId = this[Movies.exhibition_id],
        noReviews = this[Movies.no_reviews],
        totalRating = this[Movies.total_rating],
        movieLink = this[Movies.movie_link]
    )
}
