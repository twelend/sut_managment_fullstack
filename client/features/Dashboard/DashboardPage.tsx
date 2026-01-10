"use client"

import { CoursesSection, RefbookSection, Sidebar, SubjectSection } from "@/components/DashboardComponents"
import { useState } from "react"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<"courses" | "subject" | "refbook">("courses")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-auto">
        {activeSection === "courses" && <CoursesSection />}
        {activeSection === "subject" && <SubjectSection />}
        {activeSection === "refbook" && <RefbookSection />}
      </main>
    </div>
  )
}