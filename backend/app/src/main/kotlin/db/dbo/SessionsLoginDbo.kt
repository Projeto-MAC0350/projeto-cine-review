package db.dbo
import db.tables.Sessions_Logins
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class SessionsLoginDbo(
    val id: Int,
    val userId: Int,
    val loginTime: LocalDateTime,
    val logoutTime: LocalDateTime?
)

fun ResultRow.toSessionsLoginDbo(): SessionsLoginDbo {
    return SessionsLoginDbo(
        id = this[Sessions_Logins.id],
        userId = this[Sessions_Logins.user_id],
        loginTime = this[Sessions_Logins.login_time].toLocalDateTime(),
        logoutTime = this[Sessions_Logins.logout_time]?.toLocalDateTime()
    )
}
