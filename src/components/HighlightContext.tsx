/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { getProject } from "../content";

/**
 * Shared hover/selection state linking the graph, tech chips and project cards.
 *
 * - `hoverTech` / `hoverProject`: transient, set on mouse hover or focus
 * - `selectedTech`: sticky filter, set by clicking a chip
 */
interface HighlightState {
  hoverTech: string | null;
  hoverProject: string | null;
  selectedTech: string | null;
  setHoverTech: (tech: string | null) => void;
  setHoverProject: (slug: string | null) => void;
  setSelectedTech: (tech: string | null) => void;
}

const HighlightContext = createContext<HighlightState | null>(null);

export function HighlightProvider({
  children,
  initialTech = null,
}: {
  children: ReactNode;
  initialTech?: string | null;
}) {
  const [hoverTech, setHoverTech] = useState<string | null>(null);
  const [hoverProject, setHoverProject] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(initialTech);

  const value = useMemo(
    () => ({
      hoverTech,
      hoverProject,
      selectedTech,
      setHoverTech,
      setHoverProject,
      setSelectedTech,
    }),
    [hoverTech, hoverProject, selectedTech]
  );

  return (
    <HighlightContext.Provider value={value}>
      {children}
    </HighlightContext.Provider>
  );
}

export function useHighlight() {
  const context = useContext(HighlightContext);
  if (!context)
    throw Error("useHighlight must be used inside <HighlightProvider>");
  return context;
}

/**
 * Derived helpers: what is currently in focus, and whether a given
 * project / tech should be emphasized or dimmed.
 */
export function useFocus() {
  const { hoverTech, hoverProject, selectedTech } = useHighlight();
  const tech = hoverTech ?? (hoverProject ? null : selectedTech);
  const project = hoverProject ? getProject(hoverProject) : undefined;

  const hasFocus = Boolean(tech || project);

  const isProjectActive = (slug: string) => {
    if (project) return project.slug === slug;
    if (tech) return Boolean(getProject(slug)?.stack.includes(tech));
    return true;
  };

  const isTechActive = (name: string) => {
    if (project) return project.stack.includes(name);
    if (tech) return tech === name;
    return true;
  };

  return { hasFocus, isProjectActive, isTechActive, tech, project };
}
