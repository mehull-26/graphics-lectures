/**
 * Table of Contents HTML renderer
 * Converts TOC tree structure into DOM elements
 */

import type { TocNode } from './builder';

/**
 * Renders a list of TOC nodes into a <ul> element
 */
export function renderNodeList(
    nodes: TocNode[],
    depthMap: Map<number, number>
): HTMLUListElement {
    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    nodes.forEach((node) => {
        const li = document.createElement('li');
        li.className = `toc-item toc-level-${node.level}`;
        li.dataset.tocId = node.id;
        li.dataset.tocLevel = String(node.level);

        const depth = depthMap.get(node.level) ?? 0;
        li.classList.add(`toc-depth-${depth}`);

        const link = document.createElement('a');
        link.href = `#${node.id}`;
        link.textContent = node.text;
        link.className = 'toc-link';
        li.appendChild(link);

        if (node.children.length > 0) {
            li.classList.add('has-children');
            li.appendChild(renderNodeList(node.children, depthMap));
        }

        ul.appendChild(li);
    });

    return ul;
}

/**
 * Renders the complete TOC tree into a navigation element
 */
export function renderToc(
    navElement: Element,
    nodes: TocNode[],
    depthMap: Map<number, number>
): void {
    navElement.innerHTML = '';
    navElement.appendChild(renderNodeList(nodes, depthMap));
}

/**
 * Gets all TOC items as a flat array with ID lookup
 */
export function getTocItems(tocElement: Element): {
    items: HTMLElement[];
    byId: Map<string, HTMLElement>;
} {
    const items = [...tocElement.querySelectorAll('.toc-item')]
        .filter((item): item is HTMLElement => item instanceof HTMLElement);

    const byId = new Map(
        items
            .filter((item) => item.dataset.tocId)
            .map((item) => [item.dataset.tocId!, item])
    );

    return { items, byId };
}
