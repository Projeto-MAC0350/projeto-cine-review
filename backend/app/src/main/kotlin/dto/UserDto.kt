package dto

import db.dbo.UserDbo
import db.enums.USER_ROLE

data class UserDto(
    val id: Int,
    val name: String,
    val password: String,
    val email: String,
    val role: USER_ROLE,
) {
    companion object {
        fun toDbo(dto: UserDto): UserDbo {
            return UserDbo(
                id = dto.id,
                name = dto.name,
                password = dto.password,
                email = dto.email,
                role = dto.role
            )
        }
    }
}