package routes

import db.tables.Users
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction

data class RegisterRequest(val email: String, val password: String)

fun Route.authRoutes() {
    post("/register") {
        val req = call.receive<RegisterRequest>()
        transaction {
            Users.insert {
                it[email] = req.email
                it[password] = req.password // verificar possibilidade futura de criptografar
            }
        }
        call.respondText("Usuário registrado com sucesso!")
    }
}