package dto

import db.dbo.MovieDbo
import db.tables.Movies

data class MovieDto(
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
) {
    companion object {
        fun fromDbo(dbo: MovieDbo): MovieDto = MovieDto(
            id            = dbo.id,
            title         = dbo.title,
            showLink      = dbo.showLink,
            movieLink     = dbo.movieLink,
            imageLink     = dbo.imageLink,
            sessions      = dbo.sessions,
            movieInfo     = dbo.movieInfo,
            country       = dbo.country,
            countryType   = dbo.countryType,
            year          = dbo.year,
            yearType      = dbo.yearType,
            duration      = dbo.duration,
            durationType  = dbo.durationType,
            director      = dbo.director,
            directorType  = dbo.directorType,
            exhibition_id  = dbo.exhibition_id,
            noReviews     = dbo.noReviews,
            totalRating   = dbo.totalRating
        )
    }
}
