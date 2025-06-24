package db.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
import db.tables.Users
import db.tables.Movies

object Reviews : Table("reviews") {
    val id = integer("id").autoIncrement()
    val user_id = reference("user_id", Users.id)
    val movie_id = reference("movie_id", Movies.id)
    val comment = text("comment").nullable()
    val rating = integer("rating")
    val title = varchar("title", 255).nullable()
    val date = date("date").defaultExpression(CurrentTimestamp())

    override val primaryKey = PrimaryKey(id)
}