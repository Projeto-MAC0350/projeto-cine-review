package services

import db.tables.Movies
import db.dbo.MovieDbo
import db.dbo.toMovieDbo
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class MovieService {

    fun getMovies(): List<MovieDbo> {
        return transaction {
            Movies.selectAll().map { it.toMovieDbo() }
        }
    }

    fun getMovieById(id: Int): MovieDbo? {
        return transaction {
            Movies.select { Movies.id eq id }
                .mapNotNull { it.toMovieDbo() }
                .singleOrNull()
        }
    }

    fun getMoviesByExhibitionId(exhibitionId: Int): List<MovieDbo> {
        return transaction {
            Movies.select { Movies.exhibition_id eq exhibitionId }
                .map { it.toMovieDbo() }
        }
    }

    fun getMoviesByTitle(title: String): List<MovieDbo> {
        return transaction {
            Movies.select { Movies.title like "%$title%" }
                .map { it.toMovieDbo() }
        }
    }
}