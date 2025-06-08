package dto

import db.dbo.MovieDbo
import db.tables.Movies

data class MovieDto(
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
) {
    companion object {
        fun fromDbo(dbo: MovieDbo): MovieDto {
            return MovieDto(
                id = dbo.id,
                title = dbo.title,
                director = dbo.director,
                year = dbo.year,
                duration = dbo.duration,
                location = dbo.location,
                synopsis = dbo.synopsis,
                exhibitionId = dbo.exhibitionId,
                noReviews = dbo.noReviews,
                totalRating = dbo.totalRating,
                movieLink = dbo.movieLink
            )
        }
    }
}