package db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import db.tables.Exhibitions
import db.tables.Movies
import db.tables.Users
import db.tables.Reviews
import db.tables.Sessions
import db.tables.SessionsLogins

object DatabaseFactory {
    fun init() {
        Database.connect(
            url = "jdbc:postgresql://localhost:5432/cine_review",
            driver = "org.postgresql.Driver",
            user = "cine_admin",
            password = "senha6871"
        )

        // Cria as tabelas se não existirem
        transaction {
            SchemaUtils.create(Exhibitions, Movies, Users, Reviews, Sessions, SessionsLogins)
        }
    }
}
