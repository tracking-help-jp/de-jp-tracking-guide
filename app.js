const trackingInput = document.querySelector("#tracking-number");
const clearButton = document.querySelector("#clear-button");
const deutschePostLink = document.querySelector("#deutsche-post-link");
const japanPostLink = document.querySelector("#japan-post-link");
const feedback = document.querySelector("#tracking-feedback");

const DEUTSCHE_POST_URL =
  "https://www.deutschepost.de/de/s/sendungsverfolgung.html";
const DEUTSCHE_POST_BASE = `${DEUTSCHE_POST_URL}?piececode=`;
const JAPAN_POST_URL =
  "https://trackings.post.japanpost.jp/services/srv/search/input?locale=ja";
const JAPAN_POST_BASE =
  "https://trackings.post.japanpost.jp/services/srv/search/direct?locale=ja&reqCodeNo1=";

function normalizeTrackingNumber(value) {
  return value.toUpperCase().replace(/[\s-]+/g, "").replace(/[^A-Z0-9]/g, "");
}

function isUsableTrackingNumber(value) {
  return value.length >= 8 && value.length <= 32;
}

function setLinkState(link, enabled) {
  link.classList.toggle("is-disabled", !enabled);
  link.setAttribute("aria-disabled", String(!enabled));
}

function updateTrackingLinks() {
  const value = normalizeTrackingNumber(trackingInput.value);
  const enabled = isUsableTrackingNumber(value);

  if (trackingInput.value !== value) {
    trackingInput.value = value;
  }

  deutschePostLink.href = enabled
    ? `${DEUTSCHE_POST_BASE}${encodeURIComponent(value)}`
    : DEUTSCHE_POST_URL;
  japanPostLink.href = enabled
    ? `${JAPAN_POST_BASE}${encodeURIComponent(value)}`
    : JAPAN_POST_URL;

  setLinkState(deutschePostLink, enabled);
  setLinkState(japanPostLink, enabled);

  feedback.classList.toggle("is-error", value.length > 0 && !enabled);
  feedback.textContent =
    value.length > 0 && !enabled ? "追跡番号を最後まで入力してください。" : "";
  clearButton.classList.toggle("is-hidden", value.length === 0);
}

function blockDisabledLink(event) {
  if (event.currentTarget.classList.contains("is-disabled")) {
    event.preventDefault();
    trackingInput.focus();
  }
}

trackingInput.addEventListener("input", updateTrackingLinks);
trackingInput.addEventListener("blur", updateTrackingLinks);
clearButton.addEventListener("click", () => {
  trackingInput.value = "";
  updateTrackingLinks();
  trackingInput.focus();
});
deutschePostLink.addEventListener("click", blockDisabledLink);
japanPostLink.addEventListener("click", blockDisabledLink);

updateTrackingLinks();
