const navigationScript = document.currentScript;
const siteRoot = new URL("../", navigationScript.src);

// Edit these entries to add pages or change their labels.
const navigationItems = [
  { path: "", label: "About" },
  {
    label: "Simulations",
    children: [
      { path: "boids/", label: "Boids" },
      { path: "worm/", label: "Worm" },
      { path: "particles/", label: "Particles" },
    ],
  },
  {
    label: "Game",
    children: [
      { path: "goat-game/", label: "Goat game" },
    ],
  },
];

function normalizePath(pathname) {
  return pathname.replace(/index\.html$/, "").replace(/\/$/, "");
}

class SiteNavigation extends HTMLElement {
  connectedCallback() {
    // Abort old listeners if this element is reconnected.
    this.listeners?.abort();
    this.listeners = new AbortController();
    const { signal } = this.listeners;
    const nav = document.createElement("nav");
    nav.className = "route-nav";
    nav.setAttribute("aria-label", "Site navigation");

    const createLink = (item) => {
      const link = document.createElement("a");
      link.href = new URL(item.path, siteRoot).href;
      link.textContent = item.label;
      const currentPath = normalizePath(window.location.pathname);
      const isProfile = item.path === "" &&
        currentPath === normalizePath(new URL("profile/", siteRoot).pathname);

      if (normalizePath(link.pathname) === currentPath || isProfile) {
        link.setAttribute("aria-current", "page");
      }
      return link;
    };

    for (const item of navigationItems) {
      if (!item.children) {
        nav.append(createLink(item));
        continue;
      }

      const dropdown = document.createElement("details");
      dropdown.className = "nav-dropdown";
      const summary = document.createElement("summary");
      summary.textContent = item.label;
      const menu = document.createElement("div");
      menu.className = "nav-menu";
      menu.append(...item.children.map(createLink));

      if (menu.querySelector('[aria-current="page"]')) {
        summary.classList.add("nav-section-current");
      }
      dropdown.append(summary, menu);
      nav.append(dropdown);
    }

    const dropdowns = [...nav.querySelectorAll("details")];
    const closeDropdowns = (except = null) => {
      for (const dropdown of dropdowns) {
        if (dropdown !== except) dropdown.open = false;
      }
    };

    // Close the other menu before the native summary toggle runs.
    for (const dropdown of dropdowns) {
      dropdown.querySelector("summary").addEventListener("click", () => {
        closeDropdowns(dropdown);
      }, { signal });
    }
    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) closeDropdowns();
    }, { signal });
    nav.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const openDropdown = dropdowns.find((dropdown) => dropdown.open);
      if (openDropdown) {
        closeDropdowns();
        openDropdown.querySelector("summary").focus();
        event.preventDefault();
      }
    }, { signal });

    this.replaceChildren(nav);
  }

  disconnectedCallback() {
    this.listeners?.abort();
  }
}

customElements.define("site-navigation", SiteNavigation);

import("./analytics.js");
