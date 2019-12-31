import init from '../../src/api';
import {SongService, ArtistService, GenreService} from "../../src/services";


let server;
let songService = new SongService();
let artistService = new ArtistService();
let genreService = new GenreService();

let artist;
let genre;
const payload = {
  title:'Judul Apapun',
  songWriter:'unknown',
};
const payload2 = {
    title:'Judul Apapun2',
    songWriter:'unknown',
};
let artistPayload = {
    name:'Raisa',
    originPlace: 'Jakarta',
    debut:'2013-01-01'
};
let genrePayload = {
    genreName:'Pop'
};
describe('Song Service Test', function () {
    beforeAll(async ()=>{
        server = await init();
        genre = await genreService.createGenre(genrePayload);
        artistPayload.genre = genre.idGenre;
        artist = await artistService.createArtist(artistPayload);
        await songService.songRepository().clear();
    });
    beforeEach(async ()=>{
        await songService.songRepository().clear();
    });
    afterEach(async ()=>{
        await songService.songRepository().clear();
        await server.close();
    })
    describe('create song', function () {
        it('should return song when created', async function () {
            payload.idArtist = artist.id;
            const song = await songService.createSong(payload);
            expect(song).toMatchObject(payload);
        });
    });
    describe('find all song', function () {
        it('should return 2 data when 2 data exist in db', async function () {
            payload.idArtist = artist.id;
            payload2.idArtist = artist.id;

            await songService.createSong(payload);
            await songService.createSong(payload2);
            expect(await songService.findAll()).toHaveLength(2);
        });
    });
    describe('find by id song', function () {
        it('should return suitable song with id', async function () {
            payload.idArtist = artist.id;
            const song = await songService.createSong(payload);
            const actual  = await songService.findById(song.id);
            expect(actual.id).toBe(song.id);
        });
    });
    describe('update song', function () {
        it('should return new data of song when updated', async function () {
            payload.idArtist = artist.id;
            const song = await songService.createSong(payload);
            song.title = 'Judul-Judulan';
            const newSong = await songService.updateSong(song);
            expect(newSong.title).toBe(song.title);
        });
    });
    describe('delete song', function () {
        it('should delete one data when id founded', async function () {
            payload.idArtist = artist.id;

            const song = await songService.createSong(payload);
            await songService.createSong(payload2);
            await songService.deleteById(song.id);
            expect(await songService.findAll()).toHaveLength(1);
        });
    });
});