document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("nav a");

  // 为所有 target=_blank 外链补充安全属性
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    const rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
    if (!rel.includes("noopener")) rel.push("noopener");
    if (!rel.includes("noreferrer")) rel.push("noreferrer");
    a.setAttribute("rel", rel.join(" "));
  });

  // 仅处理站内锚点的点击，外链不拦截
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href") || "";
      if (!href.startsWith("#")) {
        // 外链：不处理 active 状态也不阻止默认行为
        return;
      }

      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });

        const newUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "#" +
          targetId;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
    });
  });

  function handleHashChange() {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.getElementById(hash.substring(1));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        const activeLink = document.querySelector('nav a[href="' + hash + '"]');
        if (activeLink) {
          navLinks.forEach((l) => l.classList.remove("active"));
          activeLink.classList.add("active");
        }
      }
    }
  }

  window.addEventListener("hashchange", handleHashChange);
  // 首次载入时按现有 hash 定位并高亮
  handleHashChange();
});