import { AppError } from "../../../../errors/AppError";
import { prisma } from "../../../../prisma/client";
import { CreateMovieRentDTO } from "../../dtos/CreateMovieRentDTO";

export class CreateMovieRentUseCase {
  async execute ({ movieId, userId }: CreateMovieRentDTO): Promise<void> {
    // verifica se o filme existe
    const movieExists = await prisma.movie.findUnique({
      where: {
        id: movieId
      }
    })

    if (!movieExists) {
      throw new AppError("Movie does not exists!")
    }

    // verifica se o filme não esta alugado
    const movieAlreadyRented = await prisma.movieRent.findFirst({
      where: {
        movieId
      }
    });

    if (movieAlreadyRented) {
      throw new AppError("Movie already rented!");
    }

    // verificar s eo usuário existe
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!userExists) {
      throw new AppError("User does not exists!");
    }

    // criar a locação
    await prisma.movieRent.create({
      data: {
        movieId,
        userId
      }
    })
  }
}
