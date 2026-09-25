/* The Ikem Co. · site behaviour
 * Menu overlay · floating menu button · property tabs · forms · testimonial films
 * No dependencies. Every behaviour degrades to plain HTML without JavaScript.
 */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- */
  /* Menu overlay (native dialog for focus management and Escape)      */
  /* ---------------------------------------------------------------- */

  var menu = document.getElementById("site-menu");
  var toggles = document.querySelectorAll("[data-menu-open]");
  var floater = document.querySelector(".menu-float");
  var header = document.querySelector(".site-head");
  var lastTrigger = null;

  function openMenu(trigger) {
    if (!menu) return;
    lastTrigger = trigger || null;
    if (typeof menu.showModal === "function") {
      menu.showModal();
    } else {
      menu.setAttribute("open", "");
    }
    document.body.classList.add("menu-open");
    toggles.forEach(function (t) { t.setAttribute("aria-expanded", "true"); });
    var first = menu.querySelector(".menu__primary a");
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu() {
    if (!menu) return;
    if (typeof menu.close === "function" && menu.open) {
      menu.close();
    } else {
      menu.removeAttribute("open");
    }
    document.body.classList.remove("menu-open");
    toggles.forEach(function (t) { t.setAttribute("aria-expanded", "false"); });
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus({ preventScroll: true });
    }
  }

  toggles.forEach(function (t) {
    t.addEventListener("click", function () { openMenu(t); });
  });

  if (menu) {
    menu.querySelectorAll("[data-menu-close]").forEach(function (b) {
      b.addEventListener("click", closeMenu);
    });
    menu.addEventListener("close", function () {
      document.body.classList.remove("menu-open");
      toggles.forEach(function (t) { t.setAttribute("aria-expanded", "false"); });
    });
    menu.addEventListener("cancel", function (e) {
      e.preventDefault();
      closeMenu();
    });
    menu.addEventListener("click", function (e) {
      if (e.target === menu) closeMenu();
    });
    menu.querySelectorAll("a[href]").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* Floating menu button appears once the page header has scrolled away */
  if (floater && header && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        floater.classList.toggle("is-visible", !entry.isIntersecting);
      });
    }, { rootMargin: "-8px 0px 0px 0px" });
    io.observe(header);
  } else if (floater) {
    floater.classList.add("is-visible");
  }

  /* ---------------------------------------------------------------- */
  /* Local time in Los Angeles: a quiet fact in the masthead and menu   */
  /* ---------------------------------------------------------------- */

  var clocks = Array.prototype.slice.call(document.querySelectorAll("[data-clock]"));
  if (clocks.length && window.Intl && Intl.DateTimeFormat) {
    try {
      var fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });
      var tick = function () {
        var now = new Date();
        var text = fmt.format(now).replace(/\s?(AM|PM)$/, function (m, p) { return " " + p.toLowerCase(); });
        clocks.forEach(function (c) {
          var t = c.querySelector("[data-clock-time]");
          if (t) { t.textContent = text; t.setAttribute("datetime", now.toISOString()); }
          c.hidden = false;
        });
      };
      tick();
      setTimeout(function () { tick(); setInterval(tick, 60000); }, (60 - new Date().getSeconds()) * 1000);
    } catch (e) { /* an unknown time zone leaves the clock hidden */ }
  }

  /* ---------------------------------------------------------------- */
  /* Chapter indicator: the running head of the section in view, fixed */
  /* at the foot of the page on wide screens.                          */
  /* ---------------------------------------------------------------- */

  var runheads = Array.prototype.slice.call(document.querySelectorAll("main .runhead"));
  if (runheads.length > 1 && "IntersectionObserver" in window && window.matchMedia("(min-width: 60rem)").matches) {
    var chapter = document.createElement("nav");
    chapter.className = "chapter caps";
    chapter.setAttribute("aria-label", "Chapters");
    document.body.appendChild(chapter);
    var sections = runheads.map(function (rh, i) {
      var label = rh.querySelector(".caps") ? rh.querySelector(".caps").textContent.trim() : "";
      var folio = rh.querySelector(".runhead__folio") ? rh.querySelector(".runhead__folio").textContent : "";
      var m = folio.match(/(\d{2})\s*$/);
      var el = rh.closest("section") || rh.parentElement;
      if (!el.id) el.id = "chapter-" + (m ? m[1] : String(i + 1));
      var a = document.createElement("a");
      a.href = "#" + el.id;
      a.innerHTML = '<span class="chapter__num">' + (m ? m[1] : "") + '</span><span class="chapter__label">' + label + '</span>';
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (lenis && lenis.scrollTo) lenis.scrollTo(el, { offset: -24 });
        else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      });
      chapter.appendChild(a);
      return { el: el, label: label, num: m ? m[1] : "", a: a };
    });
    var active = null;
    var setChapter = function (s) {
      if (s === active) return;
      if (active) active.a.classList.remove("is-current");
      active = s;
      if (!s) { chapter.classList.remove("is-on"); return; }
      s.a.classList.add("is-current");
      chapter.classList.add("is-on");
    };
    var foot = document.querySelector(".site-foot");
    var pick = function () {
      var line = window.innerHeight * 0.45, best = null;
      sections.forEach(function (s) {
        var r = s.el.getBoundingClientRect();
        if (r.top <= line && r.bottom > window.innerHeight * 0.15) best = s;
      });
      setChapter(best);
      if (foot) chapter.classList.toggle("is-hidden", foot.getBoundingClientRect().top < window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    pick();
  }

  /* ---------------------------------------------------------------- */
  /* Tour: the photograph follows the list item nearest the middle     */
  /* ---------------------------------------------------------------- */

  document.querySelectorAll("[data-tour]").forEach(function (tourEl) {
    var items = Array.prototype.slice.call(tourEl.querySelectorAll("[data-tour-item]"));
    var pics = Array.prototype.slice.call(tourEl.querySelectorAll("[data-tour-pic]"));
    if (!items.length) return;
    var current = 0;
    function show(i) {
      if (i === current) return;
      current = i;
      items.forEach(function (li, k) { li.classList.toggle("is-current", k === i); });
      pics.forEach(function (p, k) { p.classList.toggle("is-on", k === i); });
    }
    var hovering = -1;
    function update() {
      if (hovering >= 0) return;
      var mid = window.innerHeight * 0.5, best = -1, bestDist = Infinity;
      var r0 = tourEl.getBoundingClientRect();
      if (r0.bottom < 0 || r0.top > window.innerHeight) return;
      items.forEach(function (li, k) {
        var r = li.getBoundingClientRect();
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) { bestDist = d; best = k; }
      });
      if (best >= 0) show(best);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    items.forEach(function (li, k) {
      li.addEventListener("mouseenter", function () { hovering = k; show(k); });
      li.addEventListener("mouseleave", function () { hovering = -1; update(); });
      li.addEventListener("focusin", function () { show(k); });
    });
    update();
  });

  /* ---------------------------------------------------------------- */
  /* Masthead titles: set to the width of the page, like a nameplate   */
  /* ---------------------------------------------------------------- */

  var wideTitles = Array.prototype.slice.call(document.querySelectorAll(".fold__title--wide"));
  function fitTitles() {
    wideTitles.forEach(function (t) {
      var box = t.parentElement;
      var avail = box.clientWidth - parseFloat(getComputedStyle(box).paddingLeft) - parseFloat(getComputedStyle(box).paddingRight);
      t.style.fontSize = "";
      var base = parseFloat(getComputedStyle(t).fontSize);
      var prev = t.style.display;
      t.style.display = "inline-block";
      var w = t.getBoundingClientRect().width;
      t.style.display = prev;
      if (!w || !avail) return;
      var size = base * (avail / w);
      var cap = window.innerWidth * 0.17;
      t.style.fontSize = Math.min(size, cap).toFixed(2) + "px";
    });
  }
  if (wideTitles.length) {
    fitTitles();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles);
    var fitTimer;
    window.addEventListener("resize", function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitTitles, 120); });
  }

  /* ---------------------------------------------------------------- */
  /* Tabs (properties)                                                 */
  /* ---------------------------------------------------------------- */

  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[role=tab]"));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });

    function select(index, focus) {
      tabs.forEach(function (t, i) {
        var on = i === index;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
        if (panels[i]) {
          if (on) {
            panels[i].hidden = false;
            if (!reduceMotion) {
              panels[i].classList.remove("is-entering");
              void panels[i].offsetWidth;
              panels[i].classList.add("is-entering");
            }
          } else {
            panels[i].hidden = true;
          }
        }
      });
      if (focus) tabs[index].focus({ preventScroll: true });
      if (history.replaceState) {
        history.replaceState(null, "", "#" + tabs[index].getAttribute("aria-controls"));
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var next = i;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        else return;
        e.preventDefault();
        select(next, true);
      });
    });

    var initial = 0;
    if (location.hash) {
      var idx = tabs.findIndex(function (t) { return "#" + t.getAttribute("aria-controls") === location.hash; });
      if (idx >= 0) initial = idx;
    }
    select(initial, false);
  });

  /* ---------------------------------------------------------------- */
  /* Forms (lead capture and newsletter)                               */
  /* Progressive: without JS the form posts normally to its action.    */
  /* ---------------------------------------------------------------- */

  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function hintFor(field) {
    var scope = field.closest(".field") || field.closest("form");
    return scope ? scope.querySelector(".hint") : null;
  }

  function setHint(field, message, isError) {
    field.setAttribute("aria-invalid", isError ? "true" : "false");
    var hint = hintFor(field);
    if (!hint) return;
    hint.textContent = message || hint.getAttribute("data-default") || "";
    hint.classList.toggle("is-error", !!isError);
    if (!isError) hint.classList.remove("is-success");
  }

  function validateField(field) {
    var value = field.value.trim();
    if (field.required && !value) {
      setHint(field, field.getAttribute("data-required") || "This one is needed.", true);
      return false;
    }
    if (field.type === "email" && value && !emailRe.test(value)) {
      setHint(field, "That address is missing an @ or a domain. Check it and try again.", true);
      return false;
    }
    setHint(field, "", false);
    return true;
  }

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea, select"));
    var submit = form.querySelector("[type=submit]");
    var status = form.querySelector(".form__status, .nl .hint, .hint");
    var touched = {};

    fields.forEach(function (f) {
      var hint = hintFor(f);
      if (hint && !hint.getAttribute("data-default")) hint.setAttribute("data-default", hint.textContent);
      f.addEventListener("blur", function () { touched[f.name] = true; validateField(f); });
      f.addEventListener("input", function () { if (touched[f.name]) validateField(f); });
    });

    form.addEventListener("submit", function (e) {
      var ok = fields.map(validateField).every(Boolean);
      if (!ok) {
        e.preventDefault();
        var firstBad = fields.find(function (f) { return f.getAttribute("aria-invalid") === "true"; });
        if (firstBad) firstBad.focus({ preventScroll: false });
        return;
      }
      if (!window.fetch) return; /* let the browser post normally */
      e.preventDefault();

      var endpoint = form.getAttribute("action") || "";
      if (submit) { submit.setAttribute("data-state", "loading"); submit.setAttribute("aria-disabled", "true"); }
      if (status) { status.textContent = "Sending…"; status.classList.remove("is-error", "is-success"); }

      var honeypot = form.querySelector("[name=company_website]");
      if (honeypot && honeypot.value) {
        finish(true);
        return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function (r) {
        finish(r.ok);
      }).catch(function () {
        finish(false);
      });

      function finish(success) {
        if (submit) {
          submit.removeAttribute("data-state");
          submit.removeAttribute("aria-disabled");
          if (success) {
            /* The label change is the confirmation; the control stays put and cannot be sent twice. */
            submit.setAttribute("data-state", "success");
            submit.setAttribute("aria-disabled", "true");
            var doneLabel = submit.getAttribute("data-done");
            if (doneLabel) submit.textContent = doneLabel;
          } else {
            submit.setAttribute("data-state", "error");
            form.addEventListener("input", function clear() {
              submit.removeAttribute("data-state");
              form.removeEventListener("input", clear);
            });
          }
        }
        if (success) {
          form.setAttribute("data-state", "success");
          if (status) {
            status.textContent = form.getAttribute("data-success") || "Received. Thank you.";
            status.classList.add("is-success");
          }
          var done = form.querySelector(".form__done");
          if (done) done.setAttribute("tabindex", "-1"), done.focus({ preventScroll: true });
          form.reset();
        } else if (status) {
          status.textContent = form.getAttribute("data-failure") || "That didn’t send. Call 310.927.2344 or email directly and it will be handled.";
          status.classList.add("is-error");
        }
      }
    });
  });

  /* ---------------------------------------------------------------- */
  /* Testimonial films                                                 */
  /* ---------------------------------------------------------------- */

  var filmDialog = document.getElementById("film-dialog");
  if (filmDialog) {
    var video = filmDialog.querySelector("video");
    var title = filmDialog.querySelector("[data-film-title]");
    var note = filmDialog.querySelector("[data-film-note]");
    var opener = null;

    document.querySelectorAll("[data-film]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        opener = btn;
        var src = btn.getAttribute("data-film");
        if (title) title.textContent = btn.getAttribute("data-film-name") || "";
        if (note) note.hidden = true;
        video.src = src;
        if (typeof filmDialog.showModal === "function") filmDialog.showModal();
        else filmDialog.setAttribute("open", "");
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      });
    });

    video.addEventListener("error", function () {
      if (note) {
        note.hidden = false;
        note.textContent = "This film hasn’t been uploaded yet. The written testimonial is below the player on the previous page.";
      }
    });

    function closeFilm() {
      video.pause();
      video.removeAttribute("src");
      video.load();
      if (filmDialog.open && typeof filmDialog.close === "function") filmDialog.close();
      else filmDialog.removeAttribute("open");
      if (opener) opener.focus({ preventScroll: true });
    }

    filmDialog.querySelectorAll("[data-film-close]").forEach(function (b) { b.addEventListener("click", closeFilm); });
    filmDialog.addEventListener("click", function (e) { if (e.target === filmDialog) closeFilm(); });
    filmDialog.addEventListener("cancel", function (e) { e.preventDefault(); closeFilm(); });
  }

  /* ---------------------------------------------------------------- */
  /* Photographs: face aware crop + parallax drift inside the frame    */
  /* Each [data-px] element (picture or video) sits in a frame 16 %    */
  /* shorter than itself. The solver positions the image so the face   */
  /* (data-face="x,y" as fractions) lands about 40 % down the frame,   */
  /* then computes how far the image may drift without losing it.      */
  /* ---------------------------------------------------------------- */

  var items = [];
  var OVERHANG = 0.22;   /* fallback box height, 22 % taller than the frame (CSS: height 122%) */
  var OVERHANG_MIN = 0.10, OVERHANG_MAX = 0.34;  /* per photo: as tall as the image allows at its natural width, within this band */
  var OVERSCAN = 0.04;   /* and 4 % wider                                 (CSS: left -2%, width 104%) */
  var HEAD = 0.06;       /* the top of the head sits about 6 % of the rendered image height above the eyes */
  var FACE_REST = 0.34;  /* where the eyes should sit at rest, as a fraction of the frame */
  var FACE_MAX = 0.86;   /* the eyes never sink below this fraction of the frame */
  var ZOOM = 0.03;       /* photos are 3 % larger as they enter and settle to 1:1 as they leave, anchored on the face */
  var BODY_MAX = 0.97;   /* the upper body mark (data-body) never sinks below this fraction of the frame */
  var EASE = 0.11;       /* per frame easing of the drift, on top of the smooth scroll */

  document.querySelectorAll("[data-px]").forEach(function (el) {
    var media = el.tagName === "IMG" || el.tagName === "VIDEO" ? el : el.querySelector("img, video");
    if (!media) return;
    var face = (media.getAttribute("data-face") || "").split(",").map(parseFloat);
    var body = parseFloat(media.getAttribute("data-body"));
    items.push({
      el: el,
      media: media,
      frame: el.parentElement,
      face: face.length === 2 && !isNaN(face[0]) && !isNaN(face[1]) ? face : null,
      body: isNaN(body) ? null : body,
      nw: parseFloat(media.getAttribute("width")) || 0,
      nh: parseFloat(media.getAttribute("height")) || 0,
      F: 0, top: 0, t0: 0, rate: 0, y: 0, s: 1, settled: false
    });
  });

  /* The box (picture) is taller and wider than its frame. Its vertical offset t = top + translateY
   * moves at one constant rate r as the frame crosses the viewport: t(p) = t0 - p * r, where p runs
   * from +1 (frame entering at the bottom) to -1 (frame gone above the top).
   *   Entry side: the photo is shifted up, so the top of the head must still sit inside the frame.
   *   Exit side:  the photo slides down past the frame top. That opens a gap at the top edge, which
   *               is allowed only once the frame top is already above the viewport, so it is never
   *               seen. The rest offset t0 is chosen so both limits are met with the largest rate. */
  function measure(item) {
    var r = item.frame.getBoundingClientRect();
    var F = r.height, W = r.width;
    if (!F || !W) return;
    var vh = window.innerHeight;
    item.F = F;
    item.top = r.top + window.scrollY;
    var BW = W * (1 + OVERSCAN);
    /* Box height: the tallest box that the photo fills at its natural (width fit) size, so drift
     * comes from the photo's own height rather than from enlarging it. */
    var H = F * (1 + OVERHANG);
    if (item.nw && item.nh) {
      var rhFit = item.nh * (BW / item.nw);
      H = Math.min(F * (1 + OVERHANG_MAX), Math.max(F * (1 + OVERHANG_MIN), rhFit));
    }
    item.el.style.height = H.toFixed(1) + 'px';
    var t0 = (F - H) / 2, rate = (H - F) / 2;
    var originX = BW / 2, originY = H / 2;
    /* p at which the frame top is 7 % of F above the viewport top: a gap may open only past this point. */
    var pCrit = (-0.07 * F - vh / 2 + F / 2) / (vh / 2 + F / 2);

    if (item.face && item.nw && item.nh) {
      var s = Math.max(BW / item.nw, H / item.nh);
      var rw = item.nw * s, rh = item.nh * s;
      var fx = item.face[0] * rw, fy = item.face[1] * rh;
      /* Horizontal: keep the face where the photographer put it, clamped away from the edges.
       * When the frame shows only a narrow slice of the image (a landscape photo on a phone),
       * pull the subject toward the centre so the shoulders are not cut off. */
      var slice = Math.min(1, Math.max(0, (rw / BW - 1.2) / 1.6));
      var lo = 0.22 + 0.24 * slice, hi = 0.78 - 0.24 * slice;
      var tx = Math.min(hi, Math.max(lo, item.face[0]));
      var ox = Math.min(0, Math.max(BW - rw, tx * BW - fx));
      /* Vertical inside the box: as low as the photo allows (faces sit high in these frames). */
      var oy = Math.min(0, Math.max(H - rh, 0.5 * H - fy));
      item.media.style.objectPosition = ox.toFixed(1) + "px " + oy.toFixed(1) + "px";
      var faceX = ox + fx, faceY = oy + fy;
      var headTop = faceY - HEAD * rh;
      var bodyY = item.body !== null ? oy + item.body * rh : null;
      /* Feasible offsets: head inside the frame and the bottom covered (tLow); eyes and torso not
       * too low (tHigh). tHigh may exceed 0: that is the exit gap, allowed only once hidden. */
      var tLow = Math.min(0, Math.max(F - H, 0.03 * F - headTop));
      var tHigh = FACE_MAX * F - faceY;
      if (bodyY !== null) tHigh = Math.min(tHigh, BODY_MAX * F - bodyY);
      if (tHigh <= tLow) {
        /* Head and torso cannot both fit with room to move: hold still, torso first, head if possible. */
        t0 = Math.max(F - H, Math.min(tLow, tHigh));
        rate = 0;
      } else if (tHigh <= 0) {
        /* Everything stays inside the frame: drift across the whole feasible band. */
        t0 = (tLow + tHigh) / 2;
        rate = (tHigh - tLow) / 2;
      } else {
        /* Room to slide past the frame top on exit. r <= reach - a (entry) and r <= a / |pCrit|
         * (exit gap stays hidden); equal at the optimum. */
        var reach = -tLow;
        var a = pCrit < 0 ? reach / (1 + 1 / -pCrit) : 0;
        t0 = -a;
        rate = Math.max(0, Math.min(reach - a, tHigh - t0));
      }
      originX = faceX; originY = faceY;
    }
    item.t0 = t0;
    item.rate = rate;
    item.el.style.top = t0.toFixed(2) + "px";
    item.el.style.transformOrigin = originX.toFixed(1) + "px " + originY.toFixed(1) + "px";
    item.settled = false;
    applyItem(item, vh, window.scrollY, true);
  }

  function targetFor(it, vh, sy) {
    var top = it.top - sy;
    var p = (top + it.F / 2 - vh / 2) / (vh / 2 + it.F / 2);
    p = Math.max(-1, Math.min(1, p));
    /* Entering from below shows the lower part of the photo; leaving above shows the upper part. */
    return { y: -p * it.rate, s: 1 + ZOOM * (p + 1) / 2, visible: !(top > vh || top + it.F < 0) };
  }

  function paint(it) {
    it.el.style.transform = "translate3d(0," + it.y.toFixed(2) + "px,0) scale(" + it.s.toFixed(4) + ")";
  }

  function applyItem(it, vh, sy, snap) {
    if (!it.F) return;
    if (reduceMotion) { it.y = 0; it.s = 1; paint(it); return; }
    var target = targetFor(it, vh, sy);
    if (snap || !target.visible) {
      if (snap || !it.settled) { it.y = target.y; it.s = target.s; it.settled = true; paint(it); }
      return;
    }
    var dy = target.y - it.y, ds = target.s - it.s;
    if (Math.abs(dy) < 0.05 && Math.abs(ds) < 0.0005) {
      if (!it.settled) { it.y = target.y; it.s = target.s; it.settled = true; paint(it); }
      return;
    }
    it.y += dy * EASE;
    it.s += ds * EASE;
    it.settled = false;
    paint(it);
  }

  function measureAll() { items.forEach(measure); }

  /* Runs every animation frame (cheap for a dozen photos; the easing is what makes the drift feel
   * liquid) and also on every scroll event. If frames are being throttled, a background tab for
   * instance, the scroll path snaps straight to the target so the layout is never stale. */
  var lastFrame = 0;
  function tickParallax(fromScroll) {
    if (reduceMotion) return;
    var now = performance.now();
    var snap = !!fromScroll && (now - lastFrame > 120);
    if (!fromScroll) lastFrame = now;
    var vh = window.innerHeight, sy = window.scrollY;
    for (var i = 0; i < items.length; i++) applyItem(items[i], vh, sy, snap);
  }

  if (items.length) {
    measureAll();
    window.addEventListener("scroll", function () { tickParallax(true); }, { passive: true });
    window.addEventListener("load", measureAll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureAll);
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measureAll, 120);
    });
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function () { measureAll(); });
      items.forEach(function (it) { ro.observe(it.frame); });
    }
    if ("IntersectionObserver" in window) {
      var pio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var it = items.find(function (x) { return x.frame === entry.target; });
          if (it) { measure(it); }
        });
      }, { rootMargin: "20% 0px" });
      items.forEach(function (it) { pio.observe(it.frame); });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Lenis smooth scroll, everywhere. Falls back to native scrolling.  */
  /* ---------------------------------------------------------------- */

  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    try {
      lenis = new window.Lenis({
        lerp: 0.08,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        anchors: { offset: 0 },
        prevent: function (node) { return !!(node.closest && node.closest("dialog, [data-lenis-prevent]")); }
      });
      if (window.gsap && window.ScrollTrigger) {
        /* One clock for everything: GSAP's ticker drives Lenis, Lenis reports to ScrollTrigger. */
        window.gsap.registerPlugin(window.ScrollTrigger);
        lenis.on("scroll", window.ScrollTrigger.update);
        window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); tickParallax(); });
        window.gsap.ticker.lagSmoothing(0);
      } else {
        (function raf(time) { lenis.raf(time); tickParallax(); requestAnimationFrame(raf); })(0);
      }
    } catch (err) {
      lenis = null;
    }
  }
  if (!lenis && !reduceMotion && items.length) {
    (function raf() { tickParallax(); requestAnimationFrame(raf); })();
  }

  /* ---------------------------------------------------------------- */
  /* Choreography (GSAP). Headings arrive word by word; the first fold */
  /* plays a short intro; everything else is left still. Under reduced */
  /* motion none of this runs and the page renders in its final state. */
  /* ---------------------------------------------------------------- */

  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (gsap && ST && !reduceMotion) {
    gsap.registerPlugin(ST);
    var EASE_OUT = "power3.out";

    /* Split a plain text heading into words. The unsplit text stays for assistive technology;
     * the word spans are decorative. Headings with inline markup are left whole. */
    function splitWords(el) {
      if (el.dataset.split) return el.querySelectorAll(".w");
      if (el.children.length) return null;
      var text = el.textContent.replace(/\s+/g, " ").trim();
      if (!text || text.length > 140) return null;
      var sr = document.createElement("span");
      sr.className = "visually-hidden";
      sr.textContent = text;
      var wrap = document.createElement("span");
      wrap.className = "words";
      wrap.setAttribute("aria-hidden", "true");
      text.split(" ").forEach(function (word, i) {
        if (i) wrap.appendChild(document.createTextNode(" "));
        var w = document.createElement("span");
        w.className = "w";
        w.textContent = word;
        wrap.appendChild(w);
      });
      el.textContent = "";
      el.appendChild(sr);
      el.appendChild(wrap);
      el.dataset.split = "1";
      return wrap.querySelectorAll(".w");
    }

    /* 1. The first fold on the page: a composed intro. Nav stays put; the caption settles in. */
    var first = document.querySelector("main .fold");
    var introCaption = first ? first.querySelector(".fold__caption") : null;
    if (introCaption && first.getBoundingClientRect().top < window.innerHeight) {
      var title = introCaption.querySelector(".fold__title");
      var words = title ? splitWords(title) : null;
      var rest = Array.prototype.filter.call(introCaption.children, function (c) { return c !== title; });
      /* Hand the caption back to CSS (the pre-intro rule stops applying), then animate with explicit end states. */
      introCaption.classList.add("is-live");
      var tl = gsap.timeline({ defaults: { ease: EASE_OUT }, delay: 0.1 });
      if (words && words.length) tl.fromTo(words, { y: "0.4em", opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, 0);
      else if (title) tl.fromTo(title, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0);
      if (rest.length) tl.fromTo(rest, { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.08 }, 0.2);
      var heroImg = first.querySelector("img, video");
      if (heroImg) tl.fromTo(heroImg, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: "power2.out" }, 0);
      introCaption.dataset.intro = "done";
    }

    /* 1b. Showcase: the hero stays pinned while the property cards slide in from the right. Wide,
     * fine pointer screens only; elsewhere the row is a native horizontal scroller. */
    var showcase = document.querySelector("[data-showcase]");
    var deckEl = showcase ? showcase.querySelector("[data-deck]") : null;
    if (showcase && deckEl && window.matchMedia("(min-width: 60rem) and (pointer: fine)").matches) {
      showcase.classList.add("is-pinned");
      var cards = gsap.utils.toArray(deckEl.querySelectorAll(".card"));
      var dim = document.createElement("div");
      dim.className = "showcase__dim";
      showcase.insertBefore(dim, deckEl);
      var explore = showcase.querySelector("[data-explore]");
      if (explore) explore.hidden = false;
      /* The reader will pass every card, so fetch their photographs now rather than as they slide in. */
      deckEl.querySelectorAll("img[loading=lazy]").forEach(function (im) { im.loading = "eager"; });
      var travel = function () {
        var gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--page-gutter")) || 48;
        var last = cards[cards.length - 1];
        return Math.max(0, deckEl.offsetLeft + last.offsetLeft + last.offsetWidth - window.innerWidth + gutter);
      };
      var master = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "showcase",
          trigger: showcase,
          start: "top top",
          end: function () { return "+=" + Math.round(travel() * 0.85); },
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      master.to(deckEl, { x: function () { return -travel(); }, duration: 1 }, 0)
            .to(dim, { opacity: 0.55, duration: 0.5 }, 0);
      cards.forEach(function (card, i) {
        var img = card.querySelector(".card__media img");
        var bits = Array.prototype.slice.call(card.querySelectorAll(".card__status, .card__name, .card__price, .card__specs, .card__count, .card__go, .card__kicker, .card__lead, .card__panel .link"));
        gsap.set(bits, { y: 10, opacity: 0, filter: "blur(6px)" });
        var reveal = gsap.timeline({ paused: true, defaults: { ease: EASE_OUT } });
        reveal.to(bits, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.45, stagger: 0.07 }, 0);
        card.__on = false;
        if (i === 0 && !img) { card.__on = true; reveal.progress(1); }
        var arrive = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            containerAnimation: master,
            start: "left 96%",
            end: "left 45%",
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: function (st) {
              var on = st.progress > 0.2;
              if (on === card.__on) return;
              card.__on = on;
              if (on) reveal.timeScale(1).play();
              else if (reveal.progress() > 0) reveal.timeScale(2).reverse();
            }
          }
        });
        if (img) arrive.fromTo(card, { "--grow": 0 }, { "--grow": 1, duration: 1, ease: "none" }, 0)
                       .fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.4, ease: "none" }, 0);
        else arrive.fromTo(card, { opacity: 0.6 }, { opacity: 1, duration: 1, ease: "none" }, 0);
      });
      if (explore) explore.addEventListener("click", function () {
        var step = cards[1] ? cards[1].offsetWidth * 0.85 : window.innerHeight;
        if (lenis && lenis.scrollTo) lenis.scrollTo(window.scrollY + step, { duration: 0.9 });
        else window.scrollBy({ top: step, behavior: "smooth" });
      });
    }

    /* 2. Every other heading arrives when it enters the viewport, once. Only a page title is split
     * into words; section heads, statements, and paragraphs take a single opacity fade. */
    var heads = Array.prototype.slice.call(document.querySelectorAll("main h1, .fold__title, .section h2, .statement > p, .statement > h2, .close h2"));
    heads.forEach(function (h) {
      if (introCaption && introCaption.contains(h)) return;
      if (h.closest("dialog")) return;
      var ws = h.tagName === "H1" ? splitWords(h) : null;
      var follow = [];
      var fold = h.closest(".fold__caption");
      if (fold) follow = Array.prototype.filter.call(fold.children, function (c) { return c !== h; });
      var hang = h.closest(".head-hang");
      if (hang) follow = Array.prototype.filter.call(hang.children, function (c) { return c !== h; });
      if (h.closest(".statement") || h.closest(".close")) follow = [];
      var seq = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: h, start: "top 90%", once: true }
      });
      if (ws && ws.length) seq.fromTo(ws, { y: "0.35em", opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.03 }, 0);
      else seq.fromTo(h, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0);
      if (follow.length) seq.fromTo(follow, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, 0.1);
    });

    /* Measurements move when fonts and photographs land. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    window.addEventListener("load", function () { ST.refresh(); });

    /* Leave nothing running behind a navigation. */
    window.addEventListener("pagehide", function () {
      ST.getAll().forEach(function (t) { t.kill(); });
      gsap.globalTimeline.clear();
      if (lenis && lenis.destroy) lenis.destroy();
    }, { once: true });
  } else if (!gsap || !ST) {
    document.documentElement.classList.add("no-gsap");
  }

  /* Pause the page scroll while a dialog is open */
  document.querySelectorAll("dialog").forEach(function (d) {
    d.addEventListener("close", function () { if (lenis) lenis.start(); });
  });
  var origShow = HTMLDialogElement.prototype.showModal;
  if (origShow && lenis) {
    document.querySelectorAll("dialog").forEach(function (d) {
      d.showModal = function () { lenis.stop(); return origShow.call(d); };
    });
  }

  /* ---------------------------------------------------------------- */
  /* Hero reel: respect data saver and reduced motion                  */
  /* ---------------------------------------------------------------- */

  var reel = document.querySelector("video[data-reel]");
  if (reel) {
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData) {
      reel.removeAttribute("autoplay");
      reel.pause();
    }
    var reelToggle = document.querySelector("[data-reel-toggle]");
    if (reelToggle) {
      var reelLabel = reelToggle.querySelector("[data-reel-label]");
      function setReel(playing) {
        reelToggle.setAttribute("data-playing", playing ? "true" : "false");
        if (reelLabel) reelLabel.textContent = playing ? "Pause" : "Play";
      }
      reel.addEventListener("playing", function () { reelToggle.hidden = false; setReel(true); });
      reelToggle.addEventListener("click", function () {
        if (reel.paused) { reel.play(); setReel(true); }
        else { reel.pause(); setReel(false); }
      });
      reel.addEventListener("error", function () { reelToggle.hidden = true; });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Hover preview: rows with data-peek show their photo beside the    */
  /* cursor. Mouse and trackpad only; touch never sees it.             */
  /* ---------------------------------------------------------------- */

  var peekLinks = document.querySelectorAll("[data-peek]");
  if (peekLinks.length && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var peek = document.createElement("figure");
    peek.className = "peek";
    peek.setAttribute("aria-hidden", "true");
    var peekImg = document.createElement("img");
    peekImg.alt = "";
    peekImg.decoding = "async";
    peek.appendChild(peekImg);
    document.body.appendChild(peek);

    var GAP = 24, LAG = reduceMotion ? 1 : 0.18;
    var px = 0, py = 0, tx = 0, ty = 0, on = false, raf = 0, warmed = false;

    function place(x, y) {
      var w = peek.offsetWidth, h = peek.offsetHeight;
      var nx = x + GAP, ny = y + GAP;
      if (nx + w > window.innerWidth - GAP) nx = x - GAP - w;   /* flip left near the right edge */
      if (ny + h > window.innerHeight - GAP) ny = y - GAP - h;  /* flip up near the bottom */
      return [nx, ny];
    }

    function tick() {
      px += (tx - px) * LAG;
      py += (ty - py) * LAG;
      peek.style.translate = px.toFixed(1) + "px " + py.toFixed(1) + "px";
      if (on || Math.abs(tx - px) + Math.abs(ty - py) > 0.5) raf = requestAnimationFrame(tick);
      else raf = 0;
    }

    function warm() {
      if (warmed) return;
      warmed = true;
      peekLinks.forEach(function (a) { var i = new Image(); i.src = a.getAttribute("data-peek"); });
    }

    peekLinks.forEach(function (a) {
      a.addEventListener("pointerenter", function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        warm();
        var src = a.getAttribute("data-peek");
        if (peekImg.getAttribute("src") !== src) peekImg.src = src;
        var p = place(e.clientX, e.clientY);
        tx = p[0]; ty = p[1];
        if (!on) { px = tx; py = ty; peek.style.translate = px + "px " + py + "px"; }
        on = true;
        peek.classList.add("is-on");
        if (!raf) raf = requestAnimationFrame(tick);
      });
      a.addEventListener("pointermove", function (e) {
        if (!on) return;
        var p = place(e.clientX, e.clientY);
        tx = p[0]; ty = p[1];
        if (!raf) raf = requestAnimationFrame(tick);
      });
      a.addEventListener("pointerleave", function () {
        on = false;
        peek.classList.remove("is-on");
      });
    });
    window.addEventListener("blur", function () { on = false; peek.classList.remove("is-on"); });
  }
})();
