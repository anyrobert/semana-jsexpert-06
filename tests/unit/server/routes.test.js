import config from "../../../server/config.js";
import { handler } from "../../../server/routes";
import { Controller } from "../../../server/controller.js";
import TestUtil from "../_util/testUtil.js";

import { jest, expect, describe, test, beforeEach } from "@jest/globals";

const { pages, location, constants } = config;

describe("Routes", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  test("GET / - should redirect to home page", async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = "GET";
    params.request.url = "/";

    await handler(...params.values());

    expect(params.response.writeHead).toHaveBeenCalledWith(302, {
      Location: location.home,
    });
    expect(params.response.end).toHaveBeenCalled();
  });
  test(`GET /home - should respond with ${pages.homeHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = "GET";
    params.request.url = "/home";

    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();
    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(
      pages.homeHTML
    );
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });
  test(`GET /controller - should respond with ${pages.controllerHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = "GET";
    params.request.url = "/controller";

    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();
    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(
      pages.controllerHTML
    );
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });
  test("GET /index.html - should respond with file file stream", async () => {
    const filename = "/index.html";
    const params = TestUtil.defaultHandleParams();
    params.request.method = "GET";
    params.request.url = filename;

    const expectedType = ".html";
    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();
    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(filename);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      "Content-Type": constants.CONTENT_TYPE[expectedType],
    });
  });
  test("GET /file.ext - should respond with file file stream", async () => {
    const filename = "/file.ext";
    const params = TestUtil.defaultHandleParams();
    params.request.method = "GET";
    params.request.url = filename;

    const expectedType = ".ext";
    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();
    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(filename);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).not.toHaveBeenCalled();
  });
  test("POST /unkown - should respond with 404 when given innexistent route", async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = "POST";
    params.request.url = "/unkown";

    await handler(...params.values());

    expect(params.response.writeHead).toHaveBeenCalledWith(404);
    expect(params.response.end).toHaveBeenCalled();
  });
  describe("exceptions", () => {
    test("given inexistent file it should respond with 404", async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = "GET";
      params.request.url = "/index.png";

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(
          new Error(
            "Error: ENOENT: no such file or directory, open 'index.png'"
          )
        );
      await handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(404);
      expect(params.response.end).toHaveBeenCalled();
      expect(Controller.prototype.getFileStream).toHaveBeenCalled();
    });
    test("given inexistent error it should respond with 500", async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = "GET";
      params.request.url = "/index.png";

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error());
      await handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(500);
      expect(params.response.end).toHaveBeenCalled();
      expect(Controller.prototype.getFileStream).toHaveBeenCalled();
    });
  });
});
