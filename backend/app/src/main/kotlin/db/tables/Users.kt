package db.tables

import org.jetbrains.exposed.sql.Table
import db.enums.USER_ROLE

object Users : Table("users") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 100)
    val email = varchar("email", 100).uniqueIndex()
    val password = varchar("password", 100)
    val role = enumerationByName("role", 7, USER_ROLE::class)

    override val primaryKey = PrimaryKey(id)
}