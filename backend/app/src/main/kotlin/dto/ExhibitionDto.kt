package dto

import db.tables.Exhibitions
import db.dbo.ExhibitionDbo
import db.enums.STATUS
import java.time.LocalDate

data class ExhibitionDto(
    val id: Int,
    val title: String,
    val startDate: LocalDate,
    val endDate: LocalDate?,
    val status: STATUS,
) {
    companion object {
        fun fromDbo(dbo: ExhibitionDbo): ExhibitionDto {
            return ExhibitionDto(
                id = dbo.id,
                title = dbo.title,
                startDate = dbo.startDate,
                endDate = dbo.endDate,
                status = dbo.status
            )
        }
    }
}