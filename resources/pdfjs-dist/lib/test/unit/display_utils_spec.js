/**
 * @licstart The following is the entire license notice for the
 * JavaScript code in this page
 *
 * Copyright 2022 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * JavaScript code in this page
 */
"use strict";

var _display_utils = require("../../display/display_utils.js");
var _util = require("../../shared/util.js");
var _is_node = require("../../shared/is_node.js");
describe("display_utils", function () {
  describe("DOMCanvasFactory", function () {
    let canvasFactory;
    beforeAll(function () {
      canvasFactory = new _display_utils.DOMCanvasFactory();
    });
    afterAll(function () {
      canvasFactory = null;
    });
    it("`create` should throw an error if the dimensions are invalid", function () {
      expect(function () {
        return canvasFactory.create(-1, 1);
      }).toThrow(new Error("Invalid canvas size"));
      expect(function () {
        return canvasFactory.create(1, -1);
      }).toThrow(new Error("Invalid canvas size"));
    });
    it("`create` should return a canvas if the dimensions are valid", function () {
      if (_is_node.isNodeJS) {
        pending("Document is not supported in Node.js.");
      }
      const {
        canvas,
        context
      } = canvasFactory.create(20, 40);
      expect(canvas instanceof HTMLCanvasElement).toBe(true);
      expect(context instanceof CanvasRenderingContext2D).toBe(true);
      expect(canvas.width).toBe(20);
      expect(canvas.height).toBe(40);
    });
    it("`reset` should throw an error if no canvas is provided", function () {
      const canvasAndContext = {
        canvas: null,
        context: null
      };
      expect(function () {
        return canvasFactory.reset(canvasAndContext, 20, 40);
      }).toThrow(new Error("Canvas is not specified"));
    });
    it("`reset` should throw an error if the dimensions are invalid", function () {
      const canvasAndContext = {
        canvas: "foo",
        context: "bar"
      };
      expect(function () {
        return canvasFactory.reset(canvasAndContext, -1, 1);
      }).toThrow(new Error("Invalid canvas size"));
      expect(function () {
        return canvasFactory.reset(canvasAndContext, 1, -1);
      }).toThrow(new Error("Invalid canvas size"));
    });
    it("`reset` should alter the canvas/context if the dimensions are valid", function () {
      if (_is_node.isNodeJS) {
        pending("Document is not supported in Node.js.");
      }
      const canvasAndContext = canvasFactory.create(20, 40);
      canvasFactory.reset(canvasAndContext, 60, 80);
      const {
        canvas,
        context
      } = canvasAndContext;
      expect(canvas instanceof HTMLCanvasElement).toBe(true);
      expect(context instanceof CanvasRenderingContext2D).toBe(true);
      expect(canvas.width).toBe(60);
      expect(canvas.height).toBe(80);
    });
    it("`destroy` should throw an error if no canvas is provided", function () {
      expect(function () {
        return canvasFactory.destroy({});
      }).toThrow(new Error("Canvas is not specified"));
    });
    it("`destroy` should clear the canvas/context", function () {
      if (_is_node.isNodeJS) {
        pending("Document is not supported in Node.js.");
      }
      const canvasAndContext = canvasFactory.create(20, 40);
      canvasFactory.destroy(canvasAndContext);
      const {
        canvas,
        context
      } = canvasAndContext;
      expect(canvas).toBe(null);
      expect(context).toBe(null);
    });
  });
  describe("DOMSVGFactory", function () {
    let svgFactory;
    beforeAll(function () {
      svgFactory = new _display_utils.DOMSVGFactory();
    });
    afterAll(function () {
      svgFactory = null;
    });
    it("`create` should throw an error if the dimensions are invalid", function () {
      expect(function () {
        return svgFactory.create(-1, 0);
      }).toThrow(new Error("Invalid SVG dimensions"));
      expect(function () {
        return svgFactory.create(0, -1);
      }).toThrow(new Error("Invalid SVG dimensions"));
    });
    it("`create` should return an SVG element if the dimensions are valid", function () {
      if (_is_node.isNodeJS) {
        pending("Document is not supported in Node.js.");
      }
      const svg = svgFactory.create(20, 40);
      expect(svg instanceof SVGSVGElement).toBe(true);
      expect(svg.getAttribute("version")).toBe("1.1");
      expect(svg.getAttribute("width")).toBe("20px");
      expect(svg.getAttribute("height")).toBe("40px");
      expect(svg.getAttribute("preserveAspectRatio")).toBe("none");
      expect(svg.getAttribute("viewBox")).toBe("0 0 20 40");
    });
    it("`createElement` should throw an error if the type is not a string", function () {
      expect(function () {
        return svgFactory.createElement(true);
      }).toThrow(new Error("Invalid SVG element type"));
    });
    it("`createElement` should return an SVG element if the type is valid", function () {
      if (_is_node.isNodeJS) {
        pending("Document is not supported in Node.js.");
      }
      const svg = svgFactory.createElement("svg:rect");
      expect(svg instanceof SVGRectElement).toBe(true);
    });
  });
  describe("getFilenameFromUrl", function () {
    it("should get the filename from an absolute URL", function () {
      const url = "https://server.org/filename.pdf";
      expect((0, _display_utils.getFilenameFromUrl)(url)).toEqual("filename.pdf");
    });
    it("should get the filename from a relative URL", function () {
      const url = "../../filename.pdf";
      expect((0, _display_utils.getFilenameFromUrl)(url)).toEqual("filename.pdf");
    });
    it("should get the filename from a URL with an anchor", function () {
      const url = "https://server.org/filename.pdf#foo";
      expect((0, _display_utils.getFilenameFromUrl)(url)).toEqual("filename.pdf");
    });
    it("should get the filename from a URL with query parameters", function () {
      const url = "https://server.org/filename.pdf?foo=bar";
      expect((0, _display_utils.getFilenameFromUrl)(url)).toEqual("filename.pdf");
    });
  });
  describe("getPdfFilenameFromUrl", function () {
    it("gets PDF filename", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/file1.pdf")).toEqual("file1.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("http://www.example.com/pdfs/file2.pdf")).toEqual("file2.pdf");
    });
    it("gets fallback filename", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/file1.txt")).toEqual("document.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("http://www.example.com/pdfs/file2.txt")).toEqual("document.pdf");
    });
    it("gets custom fallback filename", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/file1.txt", "qwerty1.pdf")).toEqual("qwerty1.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("http://www.example.com/pdfs/file2.txt", "qwerty2.pdf")).toEqual("qwerty2.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/file3.txt", "")).toEqual("");
    });
    it("gets fallback filename when url is not a string", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)(null)).toEqual("document.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)(null, "file.pdf")).toEqual("file.pdf");
    });
    it("gets PDF filename from URL containing leading/trailing whitespace", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("   /pdfs/file1.pdf   ")).toEqual("file1.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("   http://www.example.com/pdfs/file2.pdf   ")).toEqual("file2.pdf");
    });
    it("gets PDF filename from query string", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/pdfs.html?name=file1.pdf")).toEqual("file1.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("http://www.example.com/pdfs/pdf.html?file2.pdf")).toEqual("file2.pdf");
    });
    it("gets PDF filename from hash string", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/pdfs.html#name=file1.pdf")).toEqual("file1.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("http://www.example.com/pdfs/pdf.html#file2.pdf")).toEqual("file2.pdf");
    });
    it("gets correct PDF filename when multiple ones are present", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/file1.pdf?name=file.pdf")).toEqual("file1.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("http://www.example.com/pdfs/file2.pdf#file.pdf")).toEqual("file2.pdf");
    });
    it("gets PDF filename from URI-encoded data", function () {
      const encodedUrl = encodeURIComponent("http://www.example.com/pdfs/file1.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)(encodedUrl)).toEqual("file1.pdf");
      const encodedUrlWithQuery = encodeURIComponent("http://www.example.com/pdfs/file.txt?file2.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)(encodedUrlWithQuery)).toEqual("file2.pdf");
    });
    it("gets PDF filename from data mistaken for URI-encoded", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/%AA.pdf")).toEqual("%AA.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("/pdfs/%2F.pdf")).toEqual("%2F.pdf");
    });
    it("gets PDF filename from (some) standard protocols", function () {
      expect((0, _display_utils.getPdfFilenameFromUrl)("http://www.example.com/file1.pdf")).toEqual("file1.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("https://www.example.com/file2.pdf")).toEqual("file2.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("file:///path/to/files/file3.pdf")).toEqual("file3.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("ftp://www.example.com/file4.pdf")).toEqual("file4.pdf");
    });
    it('gets PDF filename from query string appended to "blob:" URL', function () {
      if (_is_node.isNodeJS) {
        pending("Blob in not supported in Node.js.");
      }
      const typedArray = new Uint8Array([1, 2, 3, 4, 5]);
      const blobUrl = URL.createObjectURL(new Blob([typedArray], {
        type: "application/pdf"
      }));
      expect(blobUrl.startsWith("blob:")).toEqual(true);
      expect((0, _display_utils.getPdfFilenameFromUrl)(blobUrl + "?file.pdf")).toEqual("file.pdf");
    });
    it('gets fallback filename from query string appended to "data:" URL', function () {
      const typedArray = new Uint8Array([1, 2, 3, 4, 5]),
        str = (0, _util.bytesToString)(typedArray);
      const dataUrl = `data:application/pdf;base64,${btoa(str)}`;
      expect(dataUrl.startsWith("data:")).toEqual(true);
      expect((0, _display_utils.getPdfFilenameFromUrl)(dataUrl + "?file1.pdf")).toEqual("document.pdf");
      expect((0, _display_utils.getPdfFilenameFromUrl)("     " + dataUrl + "?file2.pdf")).toEqual("document.pdf");
    });
  });
  describe("isValidFetchUrl", function () {
    it("handles invalid Fetch URLs", function () {
      expect((0, _display_utils.isValidFetchUrl)(null)).toEqual(false);
      expect((0, _display_utils.isValidFetchUrl)(100)).toEqual(false);
      expect((0, _display_utils.isValidFetchUrl)("foo")).toEqual(false);
      expect((0, _display_utils.isValidFetchUrl)("/foo", 100)).toEqual(false);
    });
    it("handles relative Fetch URLs", function () {
      expect((0, _display_utils.isValidFetchUrl)("/foo", "file://www.example.com")).toEqual(false);
      expect((0, _display_utils.isValidFetchUrl)("/foo", "http://www.example.com")).toEqual(true);
    });
    it("handles unsupported Fetch protocols", function () {
      expect((0, _display_utils.isValidFetchUrl)("file://www.example.com")).toEqual(false);
      expect((0, _display_utils.isValidFetchUrl)("ftp://www.example.com")).toEqual(false);
    });
    it("handles supported Fetch protocols", function () {
      expect((0, _display_utils.isValidFetchUrl)("http://www.example.com")).toEqual(true);
      expect((0, _display_utils.isValidFetchUrl)("https://www.example.com")).toEqual(true);
    });
  });
  describe("PDFDateString", function () {
    describe("toDateObject", function () {
      it("converts PDF date strings to JavaScript `Date` objects", function () {
        const expectations = {
          undefined: null,
          null: null,
          42: null,
          2019: null,
          D2019: null,
          "D:": null,
          "D:201": null,
          "D:2019": new Date(Date.UTC(2019, 0, 1, 0, 0, 0)),
          "D:20190": new Date(Date.UTC(2019, 0, 1, 0, 0, 0)),
          "D:201900": new Date(Date.UTC(2019, 0, 1, 0, 0, 0)),
          "D:201913": new Date(Date.UTC(2019, 0, 1, 0, 0, 0)),
          "D:201902": new Date(Date.UTC(2019, 1, 1, 0, 0, 0)),
          "D:2019020": new Date(Date.UTC(2019, 1, 1, 0, 0, 0)),
          "D:20190200": new Date(Date.UTC(2019, 1, 1, 0, 0, 0)),
          "D:20190232": new Date(Date.UTC(2019, 1, 1, 0, 0, 0)),
          "D:20190203": new Date(Date.UTC(2019, 1, 3, 0, 0, 0)),
          "D:20190431": new Date(Date.UTC(2019, 4, 1, 0, 0, 0)),
          "D:201902030": new Date(Date.UTC(2019, 1, 3, 0, 0, 0)),
          "D:2019020300": new Date(Date.UTC(2019, 1, 3, 0, 0, 0)),
          "D:2019020324": new Date(Date.UTC(2019, 1, 3, 0, 0, 0)),
          "D:2019020304": new Date(Date.UTC(2019, 1, 3, 4, 0, 0)),
          "D:20190203040": new Date(Date.UTC(2019, 1, 3, 4, 0, 0)),
          "D:201902030400": new Date(Date.UTC(2019, 1, 3, 4, 0, 0)),
          "D:201902030460": new Date(Date.UTC(2019, 1, 3, 4, 0, 0)),
          "D:201902030405": new Date(Date.UTC(2019, 1, 3, 4, 5, 0)),
          "D:2019020304050": new Date(Date.UTC(2019, 1, 3, 4, 5, 0)),
          "D:20190203040500": new Date(Date.UTC(2019, 1, 3, 4, 5, 0)),
          "D:20190203040560": new Date(Date.UTC(2019, 1, 3, 4, 5, 0)),
          "D:20190203040506": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506F": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506Z": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506-": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506+": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506+'": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506+0": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506+01": new Date(Date.UTC(2019, 1, 3, 3, 5, 6)),
          "D:20190203040506+00'": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506+24'": new Date(Date.UTC(2019, 1, 3, 4, 5, 6)),
          "D:20190203040506+01'": new Date(Date.UTC(2019, 1, 3, 3, 5, 6)),
          "D:20190203040506+01'0": new Date(Date.UTC(2019, 1, 3, 3, 5, 6)),
          "D:20190203040506+01'00": new Date(Date.UTC(2019, 1, 3, 3, 5, 6)),
          "D:20190203040506+01'60": new Date(Date.UTC(2019, 1, 3, 3, 5, 6)),
          "D:20190203040506+0102": new Date(Date.UTC(2019, 1, 3, 3, 3, 6)),
          "D:20190203040506+01'02": new Date(Date.UTC(2019, 1, 3, 3, 3, 6)),
          "D:20190203040506+01'02'": new Date(Date.UTC(2019, 1, 3, 3, 3, 6)),
          "D:20190203040506+05'07": new Date(Date.UTC(2019, 1, 2, 22, 58, 6))
        };
        for (const [input, expectation] of Object.entries(expectations)) {
          const result = _display_utils.PDFDateString.toDateObject(input);
          if (result) {
            expect(result.getTime()).toEqual(expectation.getTime());
          } else {
            expect(result).toEqual(expectation);
          }
        }
      });
    });
  });
});