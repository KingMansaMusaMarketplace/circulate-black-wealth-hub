/*!
 * 1325.AI Embeddable Search Widget
 * Usage:
 *   <div id="mansa-search" data-token="YOUR_PARTNER_TOKEN"></div>
 *   <script src="https://1325.ai/widget.js" defer></script>
 */
(function () {
  "use strict";

  var API_URL = "https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/widget-search";
  var HOME = "https://1325.ai";

  function init() {
    var mounts = document.querySelectorAll("[data-mansa-widget], #mansa-search");
    if (!mounts.length) return;
    mounts.forEach(mount);
  }

  function mount(el) {
    if (el.__mansaMounted) return;
    el.__mansaMounted = true;

    var token = el.getAttribute("data-token") || el.getAttribute("data-partner-token");
    var accent = el.getAttribute("data-accent") || "#003366";
    var gold = "#FFB300";

    var shadow = el.attachShadow ? el.attachShadow({ mode: "open" }) : el;

    var style = document.createElement("style");
    style.textContent = [
      ":host,*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
      ".m-wrap{max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;box-shadow:0 2px 12px rgba(0,0,0,0.04)}",
      ".m-row{display:flex;gap:8px}",
      ".m-in{flex:1;padding:12px 14px;border:1px solid #d1d5db;border-radius:10px;font-size:15px;outline:none}",
      ".m-in:focus{border-color:" + accent + ";box-shadow:0 0 0 3px " + accent + "22}",
      ".m-btn{padding:12px 18px;border:0;border-radius:10px;background:" + accent + ";color:#fff;font-weight:600;cursor:pointer;font-size:15px}",
      ".m-btn:hover{opacity:.92}",
      ".m-results{margin-top:12px;display:flex;flex-direction:column;gap:8px}",
      ".m-card{display:flex;gap:12px;padding:10px;border:1px solid #eef0f3;border-radius:10px;text-decoration:none;color:#111;transition:background .15s}",
      ".m-card:hover{background:#f8fafc}",
      ".m-logo{width:44px;height:44px;border-radius:8px;background:#f1f5f9;object-fit:cover;flex-shrink:0}",
      ".m-title{font-weight:600;font-size:14px;margin:0 0 2px}",
      ".m-meta{font-size:12px;color:#64748b}",
      ".m-badge{display:inline-block;font-size:10px;font-weight:700;color:" + accent + ";background:" + accent + "15;padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle}",
      ".m-empty{padding:18px;text-align:center;color:#64748b;font-size:14px}",
      ".m-more{display:block;text-align:center;padding:10px;margin-top:6px;background:#f8fafc;border-radius:8px;text-decoration:none;color:" + accent + ";font-weight:600;font-size:14px}",
      ".m-foot{margin-top:10px;text-align:center;font-size:11px;color:#94a3b8}",
      ".m-foot a{color:" + accent + ";text-decoration:none;font-weight:600}",
      ".m-foot .gold{color:" + gold + "}",
      ".m-spin{display:inline-block;width:14px;height:14px;border:2px solid #e5e7eb;border-top-color:" + accent + ";border-radius:50%;animation:msp 0.8s linear infinite;vertical-align:middle;margin-right:6px}",
      "@keyframes msp{to{transform:rotate(360deg)}}",
    ].join("");

    var wrap = document.createElement("div");
    wrap.className = "m-wrap";
    wrap.innerHTML =
      '<div class="m-row">' +
      '  <input class="m-in" type="text" placeholder="Search Black-owned businesses…" aria-label="Search" />' +
      '  <button class="m-btn" type="button">Search</button>' +
      "</div>" +
      '<div class="m-results" aria-live="polite"></div>' +
      '<div class="m-foot">Powered by <a href="' + HOME + '?ref=widget" target="_blank" rel="noopener">1325<span class="gold">.AI</span></a> — Verified Black Business Directory</div>';

    shadow.appendChild(style);
    shadow.appendChild(wrap);

    var input = wrap.querySelector(".m-in");
    var btn = wrap.querySelector(".m-btn");
    var out = wrap.querySelector(".m-results");
    var timer = null;

    function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }

    function render(data) {
      var r = data.results || [];
      if (!r.length) {
        out.innerHTML = '<div class="m-empty">No matches. Try a different search.</div>';
        return;
      }
      var html = r.map(function (b) {
        var loc = [b.city, b.state].filter(Boolean).join(", ");
        var rating = b.rating ? '★ ' + Number(b.rating).toFixed(1) + ' (' + (b.review_count || 0) + ')' : "";
        var verified = b.is_verified ? '<span class="m-badge">✓ Verified</span>' : "";
        var logo = b.logo_url
          ? '<img class="m-logo" src="' + esc(b.logo_url) + '" alt="" loading="lazy" />'
          : '<div class="m-logo"></div>';
        return '<a class="m-card" href="' + esc(b.url) + '" target="_blank" rel="noopener">' +
          logo +
          '<div><div class="m-title">' + esc(b.name) + verified + '</div>' +
          '<div class="m-meta">' + esc(b.category || "") + (loc ? " · " + esc(loc) : "") + (rating ? " · " + rating : "") + '</div></div>' +
          '</a>';
      }).join("");
      if (data.more_url) {
        html += '<a class="m-more" href="' + esc(data.more_url) + '" target="_blank" rel="noopener">See all results on 1325.AI →</a>';
      }
      out.innerHTML = html;
    }

    function search() {
      var q = input.value.trim();
      if (!q) { out.innerHTML = ""; return; }
      out.innerHTML = '<div class="m-empty"><span class="m-spin"></span>Searching…</div>';
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, query: q, referrer: location.href }),
      })
        .then(function (r) { return r.json(); })
        .then(render)
        .catch(function () { out.innerHTML = '<div class="m-empty">Search unavailable. Please try again.</div>'; });
    }

    btn.addEventListener("click", search);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") search(); });
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(search, 400);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
