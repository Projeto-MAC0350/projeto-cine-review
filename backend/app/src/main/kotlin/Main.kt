import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import io.ktor.server.plugins.contentnegotiation.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import io.ktor.serialization.kotlinx.json.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.SchemaUtils.drop
import db.DatabaseFactory


object Users : Table("users") {
    val id = integer("id").autoIncrement()
    val email = varchar("email", 255).uniqueIndex()
    val password = varchar("password", 255)
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class UserRequest(val email: String, val password: String)

fun main() {
    DatabaseFactory.init()

    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
            })
        }

        routing {
            get("/") {
                call.respondText("API Kotlin + Exposed + PostgreSQL funcionando!")
            }

            post("/register") {
                val req = call.receive<UserRequest>()
                transaction {
                    Users.insert {
                        it[email] = req.email
                        it[password] = req.password // Colocar criptografia
                    }
                }
                call.respondText("Usuário registrado com sucesso!")
            }

            post("/login") {
                val req = call.receive<UserRequest>()
                val user = transaction {
                    Users.select { Users.email eq req.email }.singleOrNull()
                }

                if (user == null || user[Users.password] != req.password) {
                    call.respondText("Login inválido")
                } else {
                    call.respondText("Login bem-sucedido!")
                }
            }
        }
    }.start(wait = true)
}
