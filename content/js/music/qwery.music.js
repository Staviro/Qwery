/**
 * The aim here is to manage music with qwery.js
 * Given the set of music in the tracks variable
 */

/**
 * Base song object
 */
const songObj = {
  id: "",
  name: "",
  genre: "",
  artist: "",
  releaseYear: "",
};

/**
 * List of tracks
 */
const tracks = [
  {
    id: "xuMLH0AiuK4sZSxQKmjf4cp9CtHvJers",
    name: "My Song",
    genre: "R&B",
    artist: "Labi Siffre",
    releaseYear: 1972,
  },
  {
    id: "d17S79XgHLrm1OqsVDnWao16FElCou_R",
    name: "Thrrr...Phaaa!",
    genre: "Unkown",
    artist: "Selaeto Selota",
    releaseYear: 2001,
  },
  {
    id: "5K3f6ZsTBxB8ZOwOvh9b9sOZ8alBam0H",
    name: "BoGogo",
    genre: "House",
    artist: "Sam Deep, Azana",
    releaseYear: 2024,
  },
  {
    id: "PVDAQA6sesVXJO6s42w5yE3CdbiDeOUt",
    name: "Conceited",
    genre: "Hip Hop",
    artist: "Lil Uzi Vert",
    releaseYear: 2024,
  },
  {
    id: "YvcWXI6k8fAtbMP6WDNyQ3Nz3rYa1GN2",
    name: "Woods",
    genre: "Hip Hop & Rap",
    artist: "Mac Miller",
    releaseYear: 2020,
  },
  {
    id: "g3LQEGtD4f6pTZrbn28lv60fJ2DfXbuM",
    name: "Change Me",
    genre: "Hip Hop & Rap",
    artist: "BigXthaPlug",
    releaseYear: 2024,
  },
];

/**
 * 1. I want to create a playlist for all songs created in 2024
 */

const jsert_music = new Jsert("music");
const qwery_music = new Qwery({
  name: "music",
  log: false,
  encode: true,
}).create();

jsert_music.test(
  "Adding all songs from 2024 in one playlist called '2024'",
  function () {
    const ds_playlist = "playlist 2024";
    const songsOf2024 = tracks.filter((x) => x.releaseYear === 2024);

    qwery_music.addList({ dataset: ds_playlist, data: songsOf2024 });

    const data = qwery_music.getAll({ dataset: ds_playlist });

    jsert_music.passWhenTruthy(this, data.length === songsOf2024.length);
    qwery_music.reset();
  },
);

jsert_music.run();
