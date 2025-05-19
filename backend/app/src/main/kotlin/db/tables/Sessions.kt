package db.tables

import org.jetbrains.exposed.sql.Table
import db.tables.Movies
import db.enums.THEATER

object Sessions : Table("sessions") {
    val id = integer("id").autoIncrement()
    val movie_id = reference("movie_id", Movies.id)
    val theater = enumerationByName("theater", 20, THEATER::class)
    val date = datetime("date")

    override val primaryKey = PrimaryKey(id)
}