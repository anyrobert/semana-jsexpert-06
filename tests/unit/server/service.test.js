import { Service } from "../../../server/service.js";
import config from "../../../server/config.js";
import TestUtil from "../_util/testUtil.js";

import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import fs from "fs";
import { join } from "path";
import fsPromises from "fs/promises";

const {
  dir: { publicPath },
} = config;

describe("Service", () => {
  let sut;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    sut = new Service();
  });
  describe("createFileStream", () => {
    test("should call fs createReadStream with correct values", () => {
      const filepath = "any_path";
      jest.spyOn(fs, "createReadStream").mockImplementation(() => {});

      sut.createFileStream(filepath);

      expect(fs.createReadStream).toHaveBeenCalledWith(filepath);
    });
    test("should return a fileStream", async () => {
      const filename = "any_file.html";

      const mockReadableStream = TestUtil.generateReadableStream();

      jest
        .spyOn(fs, fs.createReadStream.name)
        .mockReturnValue(mockReadableStream);

      const result = await sut.createFileStream(filename);

      expect(result).toEqual(mockReadableStream);
    });
  });
  describe("getFileInfo", () => {
    test("should call fs/promises access with correct values", async () => {
      const filename = "/index.html";
      const expectedfullFilePath = join(publicPath, filename);
      const expectedResult = {
        type: ".html",
        name: expectedfullFilePath,
      };

      jest.spyOn(fsPromises, fsPromises.access.name).mockReturnValue();
      const result = await sut.getFileInfo(filename);

      expect(fsPromises.access).toHaveBeenCalledWith(expectedfullFilePath);
      expect(result).toEqual(expectedResult);
    });
    test("should return an error if file does not exist", async () => {
      const filename = "/zaaum.html";

      jest
        .spyOn(fsPromises, fsPromises.access.name)
        .mockRejectedValue(new Error("ENOENT"));

      await expect(sut.getFileInfo(filename)).rejects.toThrow();
    });
  });
  describe("getFileStream", () => {
    test("should return an object containing a stream and type", async () => {
      const filename = "/index.html";
      const mockReadableStream = TestUtil.generateReadableStream();
      const expectedType = ".html";

      jest
        .spyOn(Service.prototype, Service.prototype.getFileInfo.name)
        .mockReturnValue({
          type: expectedType,
          name: filename,
        });
      jest
        .spyOn(Service.prototype, Service.prototype.createFileStream.name)
        .mockReturnValue(mockReadableStream);

      const result = await sut.getFileStream(filename);

      expect(Service.prototype.createFileStream).toHaveBeenCalledWith(filename);
      expect(result).toEqual({
        stream: mockReadableStream,
        type: expectedType,
      });
    });
    test("should return an error if file does not exis", async () => {
      const filename = "/zaaum.html";

      jest
        .spyOn(Service.prototype, Service.prototype.getFileInfo.name)
        .mockRejectedValue(new Error("Error: ENOENT"));

      await expect(sut.getFileStream(filename)).rejects.toThrow();
      expect(Service.prototype.getFileInfo).toHaveBeenCalledWith(filename);
    });
  });
});
