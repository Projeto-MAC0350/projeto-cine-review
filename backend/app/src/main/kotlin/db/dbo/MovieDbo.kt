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
    val exhibition_id: Int,
    val noReviews: Int,
    val totalRating: Int
)

fun ResultRow.toMovieDbo(): MovieDbo = MovieDbo(
    id            = this[Movies.id],
    title         = this[Movies.title],
    showLink      = this[Movies.showLink],
    movieLink     = this[Movies.movieLink],
    imageLink     = this[Movies.imageLink],
    sessions      = this[Movies.sessions],
    movieInfo     = this[Movies.movieInfo],
    country       = this[Movies.country],
    countryType   = this[Movies.countryType],
    year          = this[Movies.year],
    yearType      = this[Movies.yearType],
    duration      = this[Movies.duration],
    durationType  = this[Movies.durationType],
    director      = this[Movies.director],
    directorType  = this[Movies.directorType],
    exhibition_id  = this[Movies.exhibition_id],
    noReviews     = this[Movies.noReviews],
    totalRating   = this[Movies.totalRating]
)
