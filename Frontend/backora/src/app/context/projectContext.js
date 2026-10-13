"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
    const [selectedProject, setSelectedProjectState] = useState(null)
    const [isReady, setIsReady] = useState(false)

    // after a refresh, read the saved project back
    useEffect(() => {
        try {
            const saved = localStorage.getItem("selectedProject")
            if (saved) setSelectedProjectState(JSON.parse(saved))
        } catch (error) {
            localStorage.removeItem("selectedProject")
        }
        setIsReady(true)
    }, [])

    // use this after creating or selecting a project (accepts the project object or just its id)
    const setSelectedProject = (project) => {
        const value = typeof project === "string" ? { _id: project } : project
        setSelectedProjectState(value)
        if (value) localStorage.setItem("selectedProject", JSON.stringify(value))
        else localStorage.removeItem("selectedProject")
    }

    const projectId = selectedProject?._id || null

    return (
        <ProjectContext.Provider value={{ selectedProject, setSelectedProject, projectId, isReady }}>
            {children}
        </ProjectContext.Provider>
    )
}

export const useProject = () => useContext(ProjectContext)