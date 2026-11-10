(function () {
    var root = document.documentElement, c = document.getElementById("bg"), x = c.getContext("2d"), W = 0, H = 0, items = [];
    var mq = matchMedia("(prefers-color-scheme: dark)"), slow = matchMedia("(prefers-reduced-motion: reduce)").matches ? .35 : 1;
    function dark() { return root.getAttribute("data-theme") !== "light" }
    function size() { var d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0) }
    var g = document.getElementById("ghost"), mx = .5, my = .5, sx = .5, sy = .5,
        B = [[.1, .6, .55, "0,150,175", .15], [.92, .05, .5, "135,55,185", .11], [.9, 1, .55, "190,170,30", .1], [.45, .05, .4, "20,80,160", .09]];
    addEventListener("mousemove", function (e) { mx = e.clientX / W; my = e.clientY / H }, { passive: true });
    function tick(t) {
        x.clearRect(0, 0, W, H); sx += (mx - sx) * .04; sy += (my - sy) * .04;
        var d = dark(), u = t * .00012 * slow, R = Math.max(W, H), cw = W / Math.max(1, Math.round(W / 94)), ox = (sx - .5) * -14, oy = (sy - .5) * -10, k;
        B.forEach(function (b, i) {
            var cx = (b[0] + Math.sin(u * (1 + i * .4) + i * 2) * .07 + (sx - .5) * .06 * (i + 1)) * W, cy = (b[1] + Math.cos(u * (1.2 + i * .3) + i) * .07 + (sy - .5) * .06 * (i + 1)) * H,
                r = x.createRadialGradient(cx, cy, 0, cx, cy, b[2] * R);
            r.addColorStop(0, "rgba(" + b[3] + "," + b[4] * (d ? 1 : 1.4) + ")"); r.addColorStop(1, "rgba(" + b[3] + ",0)");
            x.fillStyle = r; x.fillRect(0, 0, W, H)
        });
        x.strokeStyle = d ? "rgba(255,255,255,.045)" : "rgba(11,23,32,.08)"; x.lineWidth = 1; x.beginPath();
        for (k = 0; k <= W / cw + 1; k++) { x.moveTo(Math.round(k * cw + ox) + .5, 0); x.lineTo(Math.round(k * cw + ox) + .5, H) }
        for (k = 0; k * 180 <= H + 180; k++) { x.moveTo(0, Math.round(k * 180 + oy) + .5); x.lineTo(W, Math.round(k * 180 + oy) + .5) }
        x.stroke();
        if (g) g.style.transform = "translate(" + (sx - .5) * -36 + "px," + (sy - .5) * -24 + "px)";
        requestAnimationFrame(tick)
    }
    size(); tick(0);
    var lastW = W; addEventListener("resize", function () { size(); lastW = W });

    document.getElementById("theme").addEventListener("click", function () {
        var n = dark() ? "light" : "dark"; root.setAttribute("data-theme", n); document.getElementById("tc").setAttribute("content", n === "light" ? "#eef3f5" : "#050d14"); try { localStorage.setItem("theme", n) } catch (e) { }
    });

    var m = document.getElementById("menu"), nav = document.getElementById("nav");
    function setMenu(o) { nav.classList.toggle("open", o); m.setAttribute("aria-expanded", o); m.textContent = o ? "Close" : "Menu" }
    m.addEventListener("click", function () { setMenu(!nav.classList.contains("open")) });
    nav.addEventListener("click", function (e) { if (e.target.tagName == "A") setMenu(false) });
    addEventListener("keydown", function (e) { if (e.key == "Escape") setMenu(false) });

    var first = document.querySelector(".view .wrap");
    if (first) [].slice.call(first.children).forEach(function (e, i) { e.style.setProperty("--i", i) });

    var hd = document.querySelector("header");
    function sc() { hd.classList.toggle("s", scrollY > 24) } addEventListener("scroll", sc, { passive: true }); sc();
    var fm = document.getElementById("form");
    if (fm) fm.addEventListener("submit", function (e) {
        e.preventDefault(); var d = new FormData(fm), to = document.getElementById("mail").getAttribute("href").replace("mailto:", "");
        location.href = "mailto:" + to + "?subject=" + encodeURIComponent("Message from " + d.get("name")) + "&body=" + encodeURIComponent(d.get("message") + "\n\n" + d.get("name") + " · " + d.get("email"))
    });
    var fine = matchMedia("(hover:hover) and (pointer:fine)").matches, rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine) {
        // Cursor 
        var ring = document.createElement("div"), dot = document.createElement("div");
        ring.className = "cursor"; dot.className = "cursor-dot";
        ring.setAttribute("aria-hidden", "true"); dot.setAttribute("aria-hidden", "true");
        ring.appendChild(document.createElement("i")); dot.appendChild(document.createElement("i"));
        document.body.appendChild(ring); document.body.appendChild(dot);
        var tx = -100, ty = -100, rx = -100, ry = -100, dx = -100, dy = -100, seen = false,
            kr = rm ? 1 : .1,   
            kd = rm ? 1 : .35;  
        addEventListener("mousemove", function (e) {
            tx = e.clientX; ty = e.clientY;
            if (!seen) { seen = true; rx = dx = tx; ry = dy = ty; ring.classList.add("on"); dot.classList.add("on") }
            var on = !!(e.target.closest && e.target.closest("a[href]"));
            ring.classList.toggle("link", on); dot.classList.toggle("link", on)
        }, { passive: true });
        (function loop() {
            rx += (tx - rx) * kr; ry += (ty - ry) * kr; dx += (tx - dx) * kd; dy += (ty - dy) * kd;
            ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
            dot.style.transform = "translate3d(" + dx + "px," + dy + "px,0)";
            requestAnimationFrame(loop)
        })();
    }
    if (window.Lenis && fine && !rm) {
        var lenis = new Lenis({ lerp: .09 }); window.__lenis = lenis;
        (function raf(t) { lenis.raf(t); requestAnimationFrame(raf) })(performance.now());
    }
})();