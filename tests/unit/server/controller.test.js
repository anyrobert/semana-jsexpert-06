import { Controller } from "../../../server/controller.js";
import { Service } from "../../../server/service.js";

import { jest, expect, describe, test, beforeEach } from "@jest/globals";

describe("Controller", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  describe("getFileStream", () => {
    let sut;
    beforeEach(() => {
      sut = new Controller();
    });
    test("shoud call Service getFileStream with correct valyes", () => {
      const fileName = "any_name";
      jest.spyOn(Service.prototype, Service.prototype.getFileStream.name);

      sut.getFileStream(fileName);

      expect(Service.prototype.getFileStream).toHaveBeenCalledWith(fileName);
    });
  });
});
