import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.http.HttpStatusCode
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

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm

// para integrar com o angular:
import io.ktor.server.plugins.cors.*
import io.ktor.http.*
import services.*

//para consultar filmes:
import dto.*

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
data class LoginResponse(val id: Int, val name: String, val email: String, val role: USER_ROLE, val token: String)

fun main() {
    DatabaseFactory.init()

    embeddedServer(Netty, port = 8080) {

        val jwtSecret = "segredo"
        val jwtIssuer = "br.usp.rev.api"
        val jwtAudience = "rev-usp-users"
        val jwtRealm = "rev-usp-api"

        install(CORS) {
            allowHost("localhost:4200", schemes = listOf("http", "https"))

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

        install (Authentication) {
            jwt {
                realm = jwtRealm
                verifier(
                    JWT.require(Algorithm.HMAC256(jwtSecret))
                        .withAudience(jwtAudience)
                        .withIssuer(jwtIssuer)
                        .build()
                )
                validate { credential ->
                    if (credential.payload.getClaim("userId").asInt() != null) {
                        JWTPrincipal(credential.payload)
                    } else {
                        null
                    }
                }
                challenge { defaultScheme, realm ->
                    call.respond(HttpStatusCode.Unauthorized, "token invalido")
                }
            }
        }

        val movieService = MovieService()
        val userService = UserService()
        val sessionService = SessionService()
        val reviewService = ReviewService()

        routing {
            get("/") {
                call.respondText("API Kotlin + Exposed + PostgreSQL funcionando!")
            }

            route("/users") {
                get {
                    val users = userService.getUsers()
                    call.respond(users)
                }
            }

            authenticate{
                get("/perfil") {
                    val principal = call.principal<JWTPrincipal>()
                    val userId = principal?.payload?.getClaim("userId")?.asInt() ?: return@get call.respond(HttpStatusCode.BadRequest, "Usuario nao encontrado")

                    if(userId == null) {
                        call.respond(HttpStatusCode.BadRequest, "Usuario nao encontrado")
                        return@get
                    }
                    userService.getUserById(userId)
                        ?.let { call.respond(it) }
                        ?: call.respond(HttpStatusCode.NotFound, "usuario nao encontrado")

                    //val userDbo = userService.getUserById(userId)

//                    userDbo?.let {
//                        call.respond(it)
//                    } ?: call.respond(HttpStatusCode.NotFound, "usuario nao encontrado")
                }
                post("/movies/{id}/reviews"){
                    val principal = call.principal<JWTPrincipal>()
                    val userId = principal
                        ?.payload
                        ?.getClaim("userId")
                        ?.asInt()
                        ?: return@post call.respond(HttpStatusCode.Unauthorized, "Usuario precisa estar logado")
                    val movieId = call.parameters["id"]?.toIntOrNull()
                        ?: return@post call.respond(HttpStatusCode.BadRequest, "ID de filme invalida")
                    val dto = call.receive<ReviewCreateDto>()
                    val reviewDbo = reviewService.addReview(dto, userId, movieId)
                    call.respond(HttpStatusCode.Created, reviewDbo)
                }

                get("/perfil/reviews") {
                    val principal = call.principal<JWTPrincipal>()!!
                    val userId = principal.payload.getClaim("userId").asInt()
                    val dtos = reviewService
                        .getReviewsByUserId(userId)
                        .map { ReviewDto.fromDbo(it) }
                    call.respond(dtos)
                }
            }

            get("/users/{id}/reviews") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "Usuario nao encontrado")
                    return@get
                }
                val dtos = reviewService
                    .getReviewsByUserId(id)
                    .map { ReviewDto.fromDbo(it) }
                call.respond(dtos)
            }

            get("/users/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "Usuario nao encontrado")
                    return@get
                }
                val userDbo = userService.getUserById(id)

                userDbo?.let {
                    call.respond(it)
                } ?: call.respond(HttpStatusCode.NotFound, "usuario nao encontrado")
            }

            get("/movies") {
                val list = movieService.getMovies().map { MovieDto.fromDbo(it) }
                try {
                    call.respond(list)
                } catch (e: Exception) {
                    e.printStackTrace()
                    call.respondText(
                        "Erro no /movies: ${e.message}",
                        status = HttpStatusCode.InternalServerError
                    )
                }
            }

            get("/movies/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "ID invalido")
                } else {
                    movieService.getMovieById(id)
                        ?.let { call.respond(MovieDto.fromDbo(it)) }
                        ?: call.respond(HttpStatusCode.NotFound)
                }
            }

            get("/movies/{id}/reviews") {
                val movieId = call.parameters["id"]?.toIntOrNull()
                    ?: return@get call.respond(HttpStatusCode.BadRequest, "Id de filme invalida")

                val reviews = reviewService.getReviewsByMovieId(movieId)
                call.respond(reviews)
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
                    val tok = JWT.create()
                        .withAudience(jwtAudience)
                        .withIssuer(jwtIssuer)
                        .withClaim("userId", user[Users.id])
                        .withClaim("name", user[Users.name])
                        .sign(Algorithm.HMAC256(jwtSecret))

                    val userDto = LoginResponse(
                            id = user[Users.id],
                            name = user[Users.name],
                            email = user[Users.email],
                            role = user[Users.role],
                            token = tok
                    )
                    call.respond(HttpStatusCode.OK, userDto)
                }
            }

            get("/sessions") {
                val list = sessionService.getSessions().map { SessionDto.fromDbo(it) }
                try {
                    call.respond(list)
                } catch (e: Exception) {
                    e.printStackTrace()
                    call.respondText(
                        "Erro no /sessions: ${e.message}",
                        status = HttpStatusCode.InternalServerError
                    )
                }
            }
        }
    }.start(wait = true)
}
