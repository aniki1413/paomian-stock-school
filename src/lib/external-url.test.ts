import assert from "node:assert/strict";
import test from "node:test";
import { externalUrlToOpen } from "./external-url.ts";

const page = "https://localhost/play";

test("keeps same-origin and in-page links inside the app", () => {
  assert.equal(externalUrlToOpen("/characters/dad.png", page), null);
  assert.equal(externalUrlToOpen("#top", page), null);
  assert.equal(externalUrlToOpen("https://localhost/map", page), null);
});

test("returns the sponsor https URL", () => {
  assert.equal(
    externalUrlToOpen("https://www.facebook.com/aniki1313", page),
    "https://www.facebook.com/aniki1313",
  );
});

test("ignores non-http schemes", () => {
  assert.equal(externalUrlToOpen("mailto:hi@example.com", page), null);
  assert.equal(externalUrlToOpen("javascript:alert(1)", page), null);
});
