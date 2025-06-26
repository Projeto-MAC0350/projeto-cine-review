package dto

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

@Serializable
data class ReviewCreateDto(
    val title: String,
    val comment: String,
    val rating: Double
)