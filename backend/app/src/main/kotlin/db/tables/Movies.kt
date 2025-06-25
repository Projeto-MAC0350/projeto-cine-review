package db.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.datetime
import db.tables.Exhibitions

object Movies : Table("movies") {
    val id            = integer("id").autoIncrement()
    val title         = text("title")
    val showLink      = text("show_link").nullable()
    val movieLink     = text("movie_link").nullable()
    val imageLink     = text("image_link").nullable()
    val sessions      = text("sessions").nullable()
    val movieInfo     = text("movie_info").nullable()
    val country       = text("country").nullable()
    val countryType   = text("country_type").nullable()
    val year          = text("year").nullable()
    val yearType      = text("year_type").nullable()
    val duration      = text("duration").nullable()
    val durationType  = text("duration_type").nullable()
    val director      = text("director").nullable()
    val directorType  = text("director_type").nullable()
    val exhibition_id  = integer("exhibition_id").references(Exhibitions.id)
    val noReviews     = integer("no_reviews").default(0)
    val totalRating   = integer("total_rating").default(0)

    override val primaryKey = PrimaryKey(id)
}