import user from "./user.route";
import genre from "./genre.route";
import artist from "./artist.route";

const routes = [...user, ...genre, ...artist];

export default routes;