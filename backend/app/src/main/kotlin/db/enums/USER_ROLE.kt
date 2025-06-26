package db.enums

import kotlinx.serialization.Serializable

@Serializable
enum class USER_ROLE {
    REGULAR,
    ADMIN;
}