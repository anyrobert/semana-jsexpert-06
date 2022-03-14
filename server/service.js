import config from "./config.js";

import fs from "fs";
import { access } from "fs/promises";
import { extname, join } from "path";

const {
  dir: { publicPath },
} = config;

export class Service {
  createFileStream(filename) {
    return fs.createReadStream(filename);
  }

  async getFileInfo(file) {
    const fullPath = join(publicPath, file);
    await access(fullPath);
    const fileType = extname(filfullPathe);

    return { type: fileType, name: fullPath };
  }

  async getFileStream(file) {
    const { name, type } = await this.getFileInfo(file);
    return {
      stream: this.createFileStream(name),
      type,
    };
  }
}
