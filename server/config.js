import { join, dirname } from "path";
import { fileURLToPath } from "url";

const currentPath = dirname(fileURLToPath(import.meta.url));
const rootPath = join(currentPath, "../");
const audioPath = join(rootPath, "audio");
const publicPath = join(rootPath, "public");

export default {
  port: process.env.PORT || 3000,
  dir: {
    rootPath,
    publicPath,
    audioPath,
    songsPath: join(audioPath, "songs"),
    fxPath: join(audioPath, "fx"),
  },
  pages: {
    homeHTML: "home/index.html",
    controllerHTML: "controller/index.html",
  },
  location: {
    home: "/home",
  },
};
