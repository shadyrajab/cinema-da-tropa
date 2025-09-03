import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MovieRating } from "./movie-rating";

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tmdb_id: string;

  @Column()
  title: string;

  @Column({ type: 'timestamp', nullable: true })
  finished_at: Date;

  @OneToMany(() => MovieRating, movieRating => movieRating.movie)
  ratings: MovieRating[];
}