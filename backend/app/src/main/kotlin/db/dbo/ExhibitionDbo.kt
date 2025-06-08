package db.dbo

import db.tables.Exhibitions
import org.jetbrains.exposed.sql.ResultRow
import db.enums.STATUS
import java.time.LocalDate

data class ExhibitionDbo(
    val id: Int,
    val title: String,
    val startDate: LocalDate,
    val endDate: LocalDate?,
    val status: STATUS,
)

fun ResultRow.toExhibitionDbo(): ExhibitionDbo {
    return ExhibitionDbo(
        id = this[Exhibitions.id],
        title = this[Exhibitions.title],
        startDate = this[Exhibitions.start_date].toLocalDate(),
        endDate = this[Exhibitions.end_date].toLocalDate(),
        status = this[Exhibitions.status],
    )
}