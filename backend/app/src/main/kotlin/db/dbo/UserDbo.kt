package db.dbo 
import db.tables.Users
import org.jetbrains.exposed.sql.ResultRow
import db.enums.USER_ROLE

data class UserDbo(
    val id: Int,
    val username: String,
    val password: String,
    val email: String,
    val role: USER_ROLE,
)

fun ResultRow.toUserDbo(): UserDbo {
    return UserDbo(
        id = this[Users.id],
        username = this[Users.name],
        password = this[Users.password],
        email = this[Users.email],
        role = this[Users.role],
    )
}