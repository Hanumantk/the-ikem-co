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
      (function raf(time) { lenis.raf(time); tickParallax(); requestAnimationFrame(raf); })(0);
    } catch (err) {
      lenis = null;
    }
  }
  if (!lenis && !reduceMotion && items.length) {
    (function raf() { tickParallax(); requestAnimationFrame(raf); })();
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
