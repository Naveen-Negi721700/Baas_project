
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
    const [selectedProject, setSelectedProjectState] = useState(null);
    const [isReady, setIsReady] = useState(false);

    // 1. Restore the selected project after refreshing the page
    useEffect(() => {
        try {
            const saved = localStorage.getItem("selectedProject");

            if (saved) {
                setSelectedProjectState(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to restore selected project:", error);
            localStorage.removeItem("selectedProject");
        } finally {
            setIsReady(true);
        }
    }, []);

    // 2. Select a project and save it in localStorage
    // Accepts either a complete project object or a project ID
    const setSelectedProject = useCallback((project) => {
        if (!project) {
            setSelectedProjectState(null);
            localStorage.removeItem("selectedProject");
            return;
        }

        const value =
            typeof project === "string"
                ? { _id: project }
                : project;

        if (!value._id) {
            console.error("Selected project must have an _id.");
            return;
        }

        setSelectedProjectState(value);
        localStorage.setItem(
            "selectedProject",
            JSON.stringify(value)
        );
    }, []);

    // 3. Get the selected project's ID
    const projectId = selectedProject?._id || null;

    return (
        <ProjectContext.Provider
            value={{
                selectedProject,
                setSelectedProject,
                projectId,
                isReady,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

// 4. Access project information from any child component
export const useProject = () => {
    const context = useContext(ProjectContext);

    if (!context) {
        throw new Error(
            "useProject must be used inside ProjectProvider"
        );
    }

    return context;
};
