"use client";

import { useState, useDeferredValue } from "react";
import { useGetCoursesQuery, useDeleteCourseMutation } from "@/store/api/coursesApi";
import type { Course, CourseStatus } from "../types";

export function useLearn() {
  const [search,       setSearch]       = useState("");
  const [category,     setCategory]     = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "">("");
  const [editCourse,       setEditCourse]       = useState<Course | null>(null);
  const [modalOpen,        setModalOpen]        = useState(false);
  const [subtopicsCourse,  setSubtopicsCourse]  = useState<Course | null>(null);
  const [subtopicsOpen,    setSubtopicsOpen]    = useState(false);

  const deferredSearch = useDeferredValue(search);

  const { data: courses = [], isLoading, isFetching } = useGetCoursesQuery(
    deferredSearch || category || statusFilter
      ? { search: deferredSearch, category, status: statusFilter as CourseStatus || undefined }
      : undefined,
  );

  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  function openCreate() {
    setEditCourse(null);
    setModalOpen(true);
  }

  function openEdit(course: Course) {
    setEditCourse(course);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditCourse(null);
  }

  function openSubtopics(course: Course) {
    setSubtopicsCourse(course);
    setSubtopicsOpen(true);
  }

  function closeSubtopics() {
    setSubtopicsOpen(false);
    setSubtopicsCourse(null);
  }

  async function handleDelete(id: string) {
    await deleteCourse(id).unwrap();
  }

  return {
    courses,
    isLoading,
    isFetching,
    search,         setSearch,
    category,       setCategory,
    statusFilter,   setStatusFilter,
    modalOpen,      openCreate, openEdit, closeModal,
    editCourse,
    subtopicsOpen,  subtopicsCourse, openSubtopics, closeSubtopics,
    handleDelete,   isDeleting,
  };
}
