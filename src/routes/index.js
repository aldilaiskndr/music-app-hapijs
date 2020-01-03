import user from "./user.route";
import genre from "./genre.route";
import artist from "./artist.route";
import login from "./auth.route";
import song from "./song.routes"
const routes = [...user, ...genre, ...artist, ...login, ...song];

export default routes;