/**
 * JRH Engineering — Accessible Mega-Menu Navigation (Fix 17)
 * Supports: keyboard navigation, Escape to close, focus trapping,
 * click-outside-to-close, and aria-expanded toggling.
 */
(function () {
  "use strict";

  const nav = document.querySelector(".primary-nav");
  const toggle = document.querySelector(".nav-toggle");
  const dropdownButtons = nav.querySelectorAll("button[aria-haspopup]");

  // Mobile menu toggle
  toggle.addEventListener("click", function () {
    const expanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });

  // Dropdown toggle for each menu button
  dropdownButtons.forEach(function (btn) {
    const panel = btn.nextElementSibling;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = this.getAttribute("aria-expanded") === "true";

      // Close all other dropdowns first
      closeAllDropdowns();

      if (!isOpen) {
        this.setAttribute("aria-expanded", "true");
        panel.classList.add("is-open");
        // Focus first link in dropdown
        const firstLink = panel.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });

    // Keyboard support within dropdown
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && this.getAttribute("aria-expanded") === "true") {
        e.preventDefault();
        const firstLink = panel.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });

    // Arrow key navigation within dropdown links
    panel.addEventListener("keydown", function (e) {
      const links = Array.from(panel.querySelectorAll("a"));
      const idx = links.indexOf(document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (idx < links.length - 1) links[idx + 1].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) links[idx - 1].focus();
        else btn.focus(); // Return focus to trigger button
      } else if (e.key === "Escape") {
        closeAllDropdowns();
        btn.focus();
      } else if (e.key === "Tab" && !e.shiftKey && idx === links.length - 1) {
        closeAllDropdowns();
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) {
      closeAllDropdowns();
    }
  });

  // Close dropdowns on Escape anywhere
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllDropdowns();
      // Also close mobile menu
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });

  function closeAllDropdowns() {
    dropdownButtons.forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
      b.nextElementSibling.classList.remove("is-open");
    });
  }
})();
