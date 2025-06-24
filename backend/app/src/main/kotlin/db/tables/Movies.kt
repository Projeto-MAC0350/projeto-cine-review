package db.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.datetime
import db.tables.Exhibitions

object Movies : Table("movies") {
    val id = integer("id").autoIncrement()
    val title = varchar("title", 200)
    val director = varchar("director", 100).nullable()
    val year = integer("year")
    val duration = integer("duration")
    val location = varchar("location", 100).nullable()
    val synopsis = text("synopsis").nullable()
    val exhibition_id = integer("exhibition_id").references(Exhibitions.id)
    val no_reviews = integer("no_reviews").default(0)
    val total_rating = integer("total_rating").default(0)
    val movie_link = varchar("movie_link", 200).nullable()
    
    override val primaryKey = PrimaryKey(id)
}