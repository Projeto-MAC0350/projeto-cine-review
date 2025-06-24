package db.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.datetime
import db.enums.STATUS

object Exhibitions : Table("exhibitions") {
    val id = integer("id").autoIncrement()
    val title = varchar("title", 200)
    val start_date = date("start_date")
    val end_date = date("end_date").nullable()
    val status = enumerationByName("status", 7, STATUS::class)

    override val primaryKey = PrimaryKey(id)
}