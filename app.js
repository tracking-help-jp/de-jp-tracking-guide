const trackingInput = document.querySelector("#tracking-number");
const clearButton = document.querySelector("#clear-button");
const japanPostLink = document.querySelector("#japan-post-link");
const deutschePostLink = document.querySelector("#deutsche-post-link");
const feedback = document.querySelector("#tracking-feedback");

const JAPAN_POST_BASE =
  "https://trackings.post.japanpost.jp/services/srv/search/direct?locale=ja&reqCodeNo1=";
const DEUTSCHE_POST_URL =
  "https://www.deutschepost.de/de/s/sendungsverfolgung.html";
const DEUTSCHE_POST_BASE = `${DEUTSCHE_POST_URL}?piececode=`;

function normalizeTrackingNumber(value) {
  return value.toUpperCase().replace(/[\s-]+/g, "").replace(/[^A-Z0-9]/g, "");
}

function isUsableTrackingNumber(value) {
  return value.length >= 8 && value.length <= 32;
}

function setFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.classList.toggle("is-error", isError);
  trackingInput.classList.toggle("has-error", isError);
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

  japanPostLink.href = enabled
    ? `${JAPAN_POST_BASE}${encodeURIComponent(value)}`
    : "https://trackings.post.japanpost.jp/services/srv/search/input?locale=ja";
  deutschePostLink.href = enabled
    ? `${DEUTSCHE_POST_BASE}${encodeURIComponent(value)}`
    : DEUTSCHE_POST_URL;
  setLinkState(japanPostLink, enabled);
  setLinkState(deutschePostLink, enabled);

  if (value.length === 0) {
    setFeedback("");
  } else if (!enabled) {
    setFeedback("追跡番号を最後まで入力してください。", true);
  } else {
    setFeedback("追跡する郵便会社を選んでください。");
  }
}

function blockDisabledLink(event) {
  if (event.currentTarget.classList.contains("is-disabled")) {
    event.preventDefault();
    trackingInput.focus();
    setFeedback("先に追跡番号を入力してください。", true);
  }
}

trackingInput.addEventListener("input", updateTrackingLinks);
trackingInput.addEventListener("blur", () => {
  trackingInput.value = normalizeTrackingNumber(trackingInput.value);
  updateTrackingLinks();
});

clearButton.addEventListener("click", () => {
  trackingInput.value = "";
  updateTrackingLinks();
  trackingInput.focus();
});

japanPostLink.addEventListener("click", blockDisabledLink);
deutschePostLink.addEventListener("click", blockDisabledLink);

updateTrackingLinks();
