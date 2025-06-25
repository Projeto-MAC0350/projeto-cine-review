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
import db.enums.USER_ROLE

// para integrar com o angular:
import io.ktor.server.plugins.cors.*
import io.ktor.http.*
import services.*
import io.ktor.server.plugins.callloging.*
import org.slf4j.event.Level

object Users : Table("users") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val email = varchar("email", 255).uniqueIndex()
    val password = varchar("password", 255)
    val role = enumerationByName("role",7, USER_ROLE::class)
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class UserRequest(val name: String, val email: String, val password: String)

@Serializable
data class LoginResponse(val id: Int, val name: String, val email: String, val role: USER_ROLE)

fun main() {
    DatabaseFactory.init()

    embeddedServer(Netty, port = 8080) {
        install(CallLogging){
            level = Level.INFO
        }

        install(CORS) {
            allowHost("localhost:4200", schemes = listOf("http"))

            allowHeader(HttpHeaders.ContentType)
            allowHeader(HttpHeaders.Authorization)

            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Put)
            allowMethod(HttpMethod.Delete)
            allowMethod(HttpMethod.Options)

            allowCredentials = true
        }
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
                val text = call.receiveText()
                println(">>> /register raw body: $text")

                val req = try {
                    Json.decodeFromString<UserRequest>(text)
                } catch (e: Exception) {
                    e.printStackTrace()
                    call.respond(HttpStatusCode.BadRequest, "JSON inválido: ${e.message}")
                    return@post
                }
                transaction {
                    Users.insert {
                        it[name] = req.name
                        it[email] = req.email
                        it[password] = req.password // Colocar criptografia
                        it[role] = USER_ROLE.REGULAR
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
                    val userDto = LoginResponse(
                            id = user[Users.id],
                            name = user[Users.name],
                            email = user[Users.email],
                            role = user[Users.role]
                    )
                    call.respond(HttpStatusCode.OK, userDto)
                }
            }
        }
    }.start(wait = true)
}
