package db.tables

import org.jetbrains.exposed.sql.Table
import db.tables.Users
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.datetime

object SessionsLogins : Table("sessions_logins") {
    val id = integer("id").autoIncrement()
    val user_id = reference("user_id", Users.id)
    val login_time = datetime("login_time")
    val logout_time = datetime("logout_time").nullable()

    override val primaryKey = PrimaryKey(id)
}