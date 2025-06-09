package services

import db.tables.Exhibitions
import db.dbo.ExhibitionDbo
import db.enums.STATUS
import db.dbo.toExhibitionDbo
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

class ExhibitionService {

    fun getExhibitions(): List<ExhibitionDbo> {
        return transaction {
            Exhibitions.selectAll().map { it.toExhibitionDbo() }
        }
    }

    fun getExhibitionById(id: Int): ExhibitionDbo? {
        return transaction {
            Exhibitions.select { Exhibitions.id eq id }
                .mapNotNull { it.toExhibitionDbo() }
                .singleOrNull()
        }
    }
}