package dto

import db.dbo.SessionsLoginDbo
import java.time.LocalDateTime

data class SessionsLoginDto(
    val id: Int,
    val userId: Int,
    val loginTime: LocalDateTime,
    val logoutTime: LocalDateTime?
) {
    companion object {
        fun fromDbo(dbo: SessionsLoginDbo): SessionsLoginDto {
            return SessionsLoginDto(
                id = dbo.id,
                userId = dbo.userId,
                loginTime = dbo.loginTime,
                logoutTime = dbo.logoutTime
            )
        }

        fun toDbo(dto: SessionsLoginDto): SessionsLoginDbo {
            return SessionsLoginDbo(
                id = dto.id,
                userId = dto.userId,
                loginTime = dto.loginTime,
                logoutTime = dto.logoutTime
            )
        }
    }
}