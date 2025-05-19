package db.tables

import db.tables.Users

object Sessions_Logins : Table("sessions_logins") {
    val id = integer("id").autoIncrement()
    val user_id = reference("user_id", Users.id)
    val login_time = datetime("login_time")
    val logout_time = datetime("logout_time").nullable()

    override val primaryKey = PrimaryKey(id)
}