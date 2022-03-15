import config from "./config.js";

import fs from "fs";
import fsPromises from "fs/promises";
import { extname, join } from "path";

const {
  dir: { publicPath },
} = config;

export class Service {
  createFileStream(filepath) {
    return fs.createReadStream(filepath);
  }

  async getFileInfo(filename) {
    const fullPath = join(publicPath, filename);
    await fsPromises.access(fullPath);
    const fileType = extname(fullPath);

    return { type: fileType, name: fullPath };
  }

  async getFileStream(filename) {
    const { name, type } = await this.getFileInfo(filename);
    return {
      stream: this.createFileStream(name),
      type,
    };
  }
}
