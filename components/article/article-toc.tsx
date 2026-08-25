"use client";
import React, { useState, useEffect } from "react";

interface TocItem {
  id: string;
  label: string;
}

interface ArticleTocProps {
  items: TocItem[];
}

/**
 * Article table of contents.
 * Desktop: sticky side rail. Mobile: horizontally scrollable anchor chips.
 * Active section tracked via IntersectionObserver (progressive enhancement —
 * anchors work without JS; aria-current only set when observer is reliable).
 */
export function ArticleToc({ items }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to the top that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="vdit-article-toc" aria-label="On this page">
      <p className="vdit-toc-title">On this page</p>
      <ul className="vdit-toc-list">
        {items.map((item) => (
          <li key={item.id} className="vdit-toc-item">
            <a
              href={`#${item.id}`}
              className="vdit-toc-link"
              aria-current={activeId === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}