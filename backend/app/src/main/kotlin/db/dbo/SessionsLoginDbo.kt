package db.dbo

import db.tables.SessionsLogins
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
        id = this[SessionsLogins.id],
        userId = this[SessionsLogins.user_id],
        loginTime = this[SessionsLogins.login_time],
        logoutTime = this[SessionsLogins.logout_time]
    )
}
