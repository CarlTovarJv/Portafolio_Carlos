document.documentElement.classList.add("js");
try {
    var t = localStorage.getItem("theme");
    if (t) {
        document.documentElement.setAttribute("data-theme", t);
        if (t === "light") document.getElementById("tc").setAttribute("content", "#eef3f5")
    }
} catch (e) { }