package db.dbo

import db.tables.Movies
import org.jetbrains.exposed.sql.ResultRow

data class MovieDbo(
    val id: Int,
    val title: String,
    val showLink: String?,
    val movieLink: String?,
    val imageLink: String?,
    val sessions: String?,
    val movieInfo: String?,
    val country: String?,
    val countryType: String?,
    val year: String?,
    val yearType: String?,
    val duration: String?,
    val durationType: String?,
    val director: String?,
    val directorType: String?,
    val exhibitionId: Int,
    val noReviews: Int,
    val totalRating: Int
)

fun ResultRow.toMovieDbo(): MovieDbo = MovieDbo(
    id            = this[Movies.id],
    title         = this[Movies.title],
    showLink      = this[Movies.show_link],
    movieLink     = this[Movies.movie_link],
    imageLink     = this[Movies.image_link],
    sessions      = this[Movies.sessions]?.toString(),
    movieInfo     = this[Movies.movie_info],
    country       = this[Movies.country],
    countryType   = this[Movies.country_type],
    year          = this[Movies.year],
    yearType      = this[Movies.year_type],
    duration      = this[Movies.duration],
    durationType  = this[Movies.duration_type],
    director      = this[Movies.director],
    directorType  = this[Movies.director_type],
    exhibitionId  = this[Movies.exhibition_id],
    noReviews     = this[Movies.no_reviews],
    totalRating   = this[Movies.total_rating]
)
